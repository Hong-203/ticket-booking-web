import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities/ticket.entity';
import { TicketSeatBooking } from './entities/TicketSeatBooking.entity';
import { TicketConcession } from './entities/TicketConcession.entity';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { ConcessionItem } from 'src/concession-item/entities/concession-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';
import { BookingCron } from 'src/schedule/schedule.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { MailerService } from 'src/mail/mail.service';
import { BarcodeService } from 'src/barcode/barcode.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      TicketSeatBooking,
      TicketConcession,
      SeatBooking,
      ConcessionItem,
      User,
      Movie,
      Hall,
      Showtime,
      Payment,
      Seat,
    ]),
  ],
  providers: [
    TicketService,
    BookingCron,
    MailerService,
    BarcodeService,
    CloudinaryService,
  ],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
