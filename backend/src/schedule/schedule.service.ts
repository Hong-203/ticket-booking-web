import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus, SeatBookingStatus, TicketStatus } from 'src/constants';
import { Payment } from 'src/payment/entities/payment.entity';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';

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
    const result = await this.seatBookingRepo
      .createQueryBuilder()
      .delete()
      .from(SeatBooking)
      .where('status = :status', { status: SeatBookingStatus.Pending })
      // .andWhere("created_at < NOW() - INTERVAL '5 minutes'") // PostgreSQL
      .andWhere('created_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE)') // MySQL
      .execute();

    if (result.affected) {
      this.logger.log(`Đã xoá ${result.affected} booking pending quá 5 phút`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async removeExpiredPendingPayments() {
    const result = await this.paymentRepo
      .createQueryBuilder()
      .delete()
      .from(Payment)
      .where('status = :status', { status: PaymentStatus.PENDING })
      // .andWhere("created_at < NOW() - INTERVAL '5 minutes'") // PostgreSQL
      .andWhere('created_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE)') // MySQL
      .execute();

    if (result.affected) {
      this.logger.log(`Đã xoá ${result.affected} payment pending quá 5 phút`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async removeExpiredPendingTickets() {
    const result = await this.ticketRepo
      .createQueryBuilder()
      .delete()
      .from(Ticket)
      .where('status = :status', { status: TicketStatus.PENDING })
      // .andWhere("created_at < NOW() - INTERVAL '5 minutes'") // PostgreSQL
      .andWhere('created_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE)') // MySQL
      .execute();

    if (result.affected) {
      this.logger.log(`Đã xoá ${result.affected} tickets pending quá 5 phút`);
    }
  }
}
