import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
import { AssignSeatsDto } from './dto/assign-seats.dto';
import { Hall } from 'src/hall/entities/hall.entity';

@Injectable()
export class HallwiseSeatService {
  constructor(
    @InjectRepository(Hall)
    private readonly hallRepository: Repository<Hall>,

    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async assignAllSeatsToHall(hallId: string): Promise<string> {
    const hall = await this.hallRepository.findOne({
      where: { id: hallId },
      relations: ['seats'],
    });
    if (!hall) throw new NotFoundException('Hall not found');

    const allSeats = await this.seatRepository.find();

    hall.seats = allSeats; // gán tất cả seat

    await this.hallRepository.save(hall);

    return `All seats assigned to hall ${hallId} successfully`;
  }
}
