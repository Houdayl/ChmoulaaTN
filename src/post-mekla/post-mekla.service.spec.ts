import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mekla } from './post-mekla.entity';

@Injectable()
export class PostMeklaService {
  constructor(
    @InjectRepository(Mekla)
    private readonly meklaRepository: Repository<Mekla>,
  ) {}

  async create(data: Partial<Mekla>): Promise<Mekla> {
    const mekla = this.meklaRepository.create(data);
    return this.meklaRepository.save(mekla);
  }

  async findAll(): Promise<Mekla[]> {
    return this.meklaRepository.find();
  }

  async findOne(id: number): Promise<Mekla> {
    const mekla = await this.meklaRepository.findOne(id);
    if (!mekla) {
      throw new NotFoundException(`Mekla with ID ${id} not found`);
    }
    return mekla;
  }

  async update(id: number, data: Partial<Mekla>): Promise<Mekla> {
    await this.meklaRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.meklaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Mekla with ID ${id} not found`);
    }
  }
}
