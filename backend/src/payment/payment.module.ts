import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { PaymentController } from './payment.controller';
import { BookingCron } from 'src/schedule/schedule.service';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Ticket, SeatBooking])],
  providers: [PaymentService, BookingCron],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
