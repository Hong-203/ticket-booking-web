import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus, SeatBookingStatus, TicketStatus } from 'src/constants';
import { Payment } from 'src/payment/entities/payment.entity';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class BookingCron {
  private readonly logger = new Logger(BookingCron.name);

  constructor(
    @InjectRepository(SeatBooking)
    private readonly seatBookingRepo: Repository<SeatBooking>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async removeExpiredPendingBookings() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const expired = await this.seatBookingRepo.find({
      where: {
        status: SeatBookingStatus.Pending,
        created_at: LessThan(fiveMinutesAgo),
      },
    });

    if (expired.length) {
      await this.seatBookingRepo.remove(expired);
      this.logger.log(`Đã xoá ${expired.length} booking pending quá 5 phút`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async removeExpiredPendingPayments() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const expired = await this.paymentRepo.find({
      where: {
        status: PaymentStatus.PENDING,
        created_at: LessThan(fiveMinutesAgo),
      },
    });

    if (expired.length) {
      await this.paymentRepo.remove(expired);
      this.logger.log(`Đã xoá ${expired.length} payment pending quá 5 phút`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async removeExpiredPendingTickets() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const expired = await this.ticketRepo.find({
      where: {
        status: TicketStatus.PENDING,
        created_at: LessThan(fiveMinutesAgo),
      },
    });

    if (expired.length) {
      await this.ticketRepo.remove(expired);
      this.logger.log(`Đã xoá ${expired.length} tickets pending quá 5 phút`);
    }
  }
}
