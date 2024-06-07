import { Module } from '@nestjs/common';
import { PostMeklaService } from './post-mekla.service';
import { PostMeklaController } from './post-mekla.controller';

@Module({
  providers: [PostMeklaService],
  controllers: [PostMeklaController]
})
export class PostMeklaModule {}
