import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';
import { TicketStatus } from 'src/constants';

@Injectable()
export class StaticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,

    @InjectRepository(SeatBooking)
    private readonly seatBookingRepo: Repository<SeatBooking>,

    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}

  // ===============================
  // 1️⃣ Tổng quan toàn hệ thống
  // ===============================
  async getSystemOverview() {
    const [users, tickets, payments, movies] = await Promise.all([
      this.userRepo.count(),
      this.ticketRepo.count(),
      this.paymentRepo.count(),
      this.movieRepo.count(),
    ]);

    const revenue = await this.paymentRepo
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('p.status = :status', { status: 'COMPLETED' })
      .getRawOne();

    return {
      totalUsers: users,
      totalTickets: tickets,
      totalPayments: payments,
      totalMovies: movies,
      totalRevenue: Number(revenue?.total ?? 0),
    };
  }

  // ===============================
  // 2️⃣ Thống kê người dùng
  // ===============================
  async getUserStats() {
    const totalUsers = await this.userRepo.count();

    const newUsersThisMonth = await this.userRepo
      .createQueryBuilder('u')
      .where('MONTH(u.created_at) = MONTH(CURDATE())')
      .andWhere('YEAR(u.created_at) = YEAR(CURDATE())')
      .getCount();

    const activeUsers = await this.userRepo
      .createQueryBuilder('u')
      .where('u.is_active = true')
      .getCount();

    return { totalUsers, newUsersThisMonth, activeUsers };
  }

  // ===============================
  // 3️⃣ Thống kê vé & doanh thu
  // ===============================
  async getTicketAndRevenueStats() {
    const totalTickets = await this.ticketRepo.count();

    const pending = await this.ticketRepo.count({
      where: { status: TicketStatus.PENDING },
    });
    const completed = await this.ticketRepo.count({
      where: { status: TicketStatus.BOOKED },
    });

    const totalRevenue = await this.paymentRepo
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'sum')
      .where('p.status = :status', { status: 'COMPLETED' })
      .getRawOne();

    return {
      totalTickets,
      pending,
      completed,
      totalRevenue: Number(totalRevenue.sum ?? 0),
    };
  }

  // ===============================
  // 4️⃣ Thống kê phim (theo lượt đặt & doanh thu)
  // ===============================
  async getMovieStats() {
    const result = await this.paymentRepo
      .createQueryBuilder('p')
      .leftJoin('p.ticket', 't')
      .leftJoin('t.seatBookings', 'tsb')
      .leftJoin('tsb.seatBooking', 'sb')
      .leftJoin('sb.shownIn', 'si')
      .leftJoin('si.movie', 'm')
      .select('m.name', 'movie')
      .addSelect('COUNT(p.id)', 'ticketsSold')
      .addSelect('SUM(p.amount)', 'revenue')
      .where('p.status = :status', { status: 'COMPLETED' })
      .groupBy('m.name')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    return result;
  }

  // ===============================
  // 5️⃣ Thống kê theo ngày / tháng
  // ===============================
  async getRevenueByMonth() {
    return this.paymentRepo
      .createQueryBuilder('p')
      .select("DATE_FORMAT(p.created_at, '%Y-%m')", 'month')
      .addSelect('SUM(p.amount)', 'revenue')
      .where('p.status = :status', { status: 'COMPLETED' })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }
}
