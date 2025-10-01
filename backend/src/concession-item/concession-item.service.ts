import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcessionItemDto } from './dto/create-concession-item.dto';
import { UpdateConcessionItemDto } from './dto/update-concession-item.dto';
import { ConcessionItem } from './entities/concession-item.entity';

@Injectable()
export class ConcessionItemsService {
  constructor(
    @InjectRepository(ConcessionItem)
    private readonly itemRepo: Repository<ConcessionItem>,
  ) {}

  async create(dto: CreateConcessionItemDto): Promise<ConcessionItem> {
    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  findAll(): Promise<ConcessionItem[]> {
    return this.itemRepo.find();
  }

  async findOne(id: string): Promise<ConcessionItem> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Concession item ${id} not found`);
    return item;
  }

  async update(
    id: string,
    dto: UpdateConcessionItemDto,
  ): Promise<ConcessionItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepo.remove(item);
  }
}
