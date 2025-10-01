import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { QuerySeatsDto } from './dto/query-seat.dto';
import { PaginationResult } from 'src/interface/pagination-result.interface';
import { paginate } from 'src/utils/pagination.util';
import { SeatBooking } from './entities/seat_booking.entity';
import { SeatBookingStatus } from 'src/constants';
import { CreateSeatBookingDto } from './dto/seat-booking.dto';
import { customPaginateSeats } from 'src/utils/custom-paginate-seats';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,

    @InjectRepository(SeatBooking)
    private readonly seatBookingRepo: Repository<SeatBooking>,
  ) {}

  async create(createSeatDtos: CreateSeatDto[]): Promise<Seat[]> {
    const seats = this.seatRepository.create(createSeatDtos);
    return await this.seatRepository.save(seats);
  }

  async findAll(filters: QuerySeatsDto): Promise<PaginationResult<Seat>> {
    const qb = this.seatRepository.createQueryBuilder('seat');

    if (filters.type) {
      qb.where('seat.name LIKE :type', { type: `${filters.type}%` });
    }

    if (filters.status) {
      qb.andWhere('seat.status = :status', { status: filters.status });
    }

    return customPaginateSeats(qb, filters.page, filters.limit);
  }

  async findOne(id: string): Promise<Seat> {
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat) throw new NotFoundException('Seat not found');
    return seat;
  }

  async update(id: string, updateSeatDto: UpdateSeatDto): Promise<Seat> {
    const seat = await this.findOne(id);
    const updated = Object.assign(seat, updateSeatDto);
    return await this.seatRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const seat = await this.findOne(id);
    await this.seatRepository.remove(seat);
  }

  // seat booking
  async createSeatBookings(
    user_id: string,
    dto: CreateSeatBookingDto,
  ): Promise<SeatBooking[]> {
    const { seat_ids, movie_id, hall_id, showtime_id } = dto;

    const bookings: SeatBooking[] = [];

    for (const seat_id of seat_ids) {
      const existing = await this.seatBookingRepo.findOne({
        where: { seat_id, movie_id, hall_id, showtime_id },
      });

      if (existing) {
        throw new BadRequestException(
          `Ghế ${seat_id} đã được đặt hoặc đang giữ`,
        );
      }

      const booking = this.seatBookingRepo.create({
        user_id,
        seat_id,
        movie_id,
        hall_id,
        showtime_id,
        status: SeatBookingStatus.Pending,
      });

      await this.seatBookingRepo.save(booking);
      bookings.push(booking);
    }

    return bookings;
  }

  async getAvailableSeats(
    movie_id: string,
    hall_id: string,
    showtime_id: string,
  ) {
    const seats = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoin(
        'seat_booking',
        'booking',
        `booking.seat_id = seat.id
     AND booking.movie_id = :movie_id
     AND booking.hall_id = :hall_id
     AND booking.showtime_id = :showtime_id`,
        { movie_id, hall_id, showtime_id },
      )
      .addSelect('booking.status', 'booking_status')
      .addSelect('booking.user_id', 'booking_user_id')
      .orderBy(`SUBSTRING(seat.name, 1, 1)`, 'ASC') // A → B → C
      .addOrderBy(`CAST(SUBSTRING(seat.name, 2) AS UNSIGNED)`, 'ASC') // 1 → 2 → 10 → 24
      .getRawAndEntities();

    return seats.entities.map((seat, index) => {
      const bookingStatus = seats.raw[index]?.booking_status;
      const userId = seats.raw[index]?.booking_user_id;

      let status: SeatBookingStatus;
      if (bookingStatus === SeatBookingStatus.Booked) {
        status = SeatBookingStatus.Booked;
      } else if (bookingStatus === SeatBookingStatus.Pending) {
        status = SeatBookingStatus.Pending;
      } else {
        // bookingStatus là 'Cancelled' hoặc null (chưa có booking nào)
        status = SeatBookingStatus.Empty;
      }

      return {
        ...seat,
        status,
        user_id: userId ?? null,
      };
    });
  }
}
