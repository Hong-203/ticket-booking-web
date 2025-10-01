import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtimes.entity';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepo: Repository<Showtime>,
  ) {}

  create(dto: CreateShowtimeDto): Promise<Showtime> {
    const showtime = this.showtimeRepo.create(dto);
    return this.showtimeRepo.save(showtime);
  }

  findAll(): Promise<Showtime[]> {
    return this.showtimeRepo.find();
  }

  async findOne(id: string): Promise<Showtime> {
    const showtime = await this.showtimeRepo.findOne({ where: { id } });
    if (!showtime) throw new NotFoundException(`Showtime ${id} not found`);
    return showtime;
  }

  async update(id: string, dto: UpdateShowtimeDto): Promise<Showtime> {
    const showtime = await this.findOne(id);
    Object.assign(showtime, dto);
    return this.showtimeRepo.save(showtime);
  }

  async remove(id: string): Promise<void> {
    const result = await this.showtimeRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Showtime ${id} not found`);
  }
}
