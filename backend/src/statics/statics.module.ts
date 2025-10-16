import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticsService } from './statics.service';
import { StaticsController } from './statics.controller';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Ticket,
      Payment,
      Movie,
      SeatBooking,
      Showtime,
    ]),
  ],
  providers: [StaticsService],
  controllers: [StaticsController],
})
export class StaticsModule {}
