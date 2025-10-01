import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Hall } from './entities/hall.entity';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Seat } from 'src/seat/entities/seat.entity';
import { QuerySeatsDto } from 'src/seat/dto/query-seat.dto';
import { PaginationResult } from 'src/interface/pagination-result.interface';

@Injectable()
export class HallService {
  constructor(
    @InjectRepository(Hall)
    private hallRepository: Repository<Hall>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  async create(createHallDto: CreateHallDto): Promise<Hall> {
    const hall = this.hallRepository.create({
      ...createHallDto,
      theatre: { id: createHallDto.theatre },
    });
    return await this.hallRepository.save(hall);
  }

  async findAll(): Promise<Hall[]> {
    return await this.hallRepository.find({ relations: ['theatre'] });
  }

  async findOne(id: string): Promise<Hall> {
    const hall = await this.hallRepository.findOne({
      where: { id },
      relations: ['theatre'],
    });
    if (!hall) throw new NotFoundException('Hall not found');
    return hall;
  }

  async update(id: string, updateHallDto: UpdateHallDto) {
    const hall = await this.findOne(id);
    Object.assign(hall, updateHallDto);
    return await this.hallRepository.save(hall);
  }

  async remove(id: string): Promise<void> {
    const hall = await this.findOne(id);
    await this.hallRepository.remove(hall);
  }

  async getSeatsByHallId(
    hallId: string,
    query: QuerySeatsDto,
  ): Promise<PaginationResult<Seat>> {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } });
    if (!hall) throw new NotFoundException(`Hall with id ${hallId} not found`);

    const qb = this.seatRepository
      .createQueryBuilder('seat')
      .innerJoin('seat.halls', 'hall', 'hall.id = :hallId', { hallId });

    if (query.status) {
      qb.andWhere('LOWER(seat.status) = LOWER(:status)', {
        status: query.status,
      });
    }

    const where: any = {};
    if (query.type) {
      where.name = Like(`${query.type}%`);
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getHallsByTheatre(theatreId: string): Promise<Hall[]> {
    return this.hallRepository.find({
      where: { theatre: { id: theatreId } },
      relations: ['theatre'],
    });
  }
}
