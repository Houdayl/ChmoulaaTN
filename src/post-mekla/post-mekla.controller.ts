import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { PostMeklaService } from './post-mekla.service';
import { Mekla } from './post-mekla.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'Multer';
import * as Maulter from 'Multer'; // Import multer

import { extname } from 'path';

@Controller('post-mekla')
export class PostMeklaController {
  constructor(private readonly postMeklaService: PostMeklaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File): Promise<Mekla> {
    if (!file) {
      throw new BadRequestException('File upload is required');
    }
    const data = { ...body, filePath: file.path };
    return this.postMeklaService.create(data);
  }
}
