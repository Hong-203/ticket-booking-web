// src/seat/seat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { SeatBooking } from './entities/seat_booking.entity';
import { BookingCron } from 'src/schedule/schedule.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, SeatBooking, Payment, Ticket])],
  controllers: [SeatController],
  providers: [SeatService, BookingCron],
})
export class SeatModule {}
