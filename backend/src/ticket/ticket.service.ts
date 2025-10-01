import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { TicketSeatBooking } from './entities/TicketSeatBooking.entity';
import { TicketConcession } from './entities/TicketConcession.entity';
import { ConcessionItem } from 'src/concession-item/entities/concession-item.entity';
import { console } from 'inspector';
import { Movie } from 'src/movie/entities/movie.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(SeatBooking)
    private readonly seatBookingRepository: Repository<SeatBooking>,

    @InjectRepository(TicketSeatBooking)
    private readonly ticketSeatBookingRepository: Repository<TicketSeatBooking>,

    @InjectRepository(TicketConcession)
    private readonly ticketConcessionRepository: Repository<TicketConcession>,

    @InjectRepository(ConcessionItem)
    private readonly concessionItemRepository: Repository<ConcessionItem>,

    @InjectRepository(Showtime)
    private readonly shownTimeRepository: Repository<Showtime>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Hall)
    private readonly hallRepository: Repository<Hall>,
  ) {}

  async createTicket(
    data: {
      seat_total_price: number;
      concession_total_price: number;
      seat_booking_ids: string[];
      concessions: { item_id: string; quantity: number }[];
    },
    user_id: string,
  ): Promise<Ticket> {
    const {
      seat_total_price,
      concession_total_price,
      seat_booking_ids,
      concessions,
    } = data;

    const total_price = seat_total_price + concession_total_price;

    // 1. Tạo ticket
    const ticket = this.ticketRepository.create({
      user: { id: user_id } as any,
      seat_total_price,
      concession_total_price,
      total_price,
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // 2. Tạo TicketSeatBooking
    console.log('seat_booking_ids', seat_booking_ids);

    const seatBookings = await this.seatBookingRepository.find({
      where: {
        id: In(seat_booking_ids),
      },
    });
    console.log('seatBookings', seatBookings);
    if (seatBookings.length !== seat_booking_ids.length) {
      throw new BadRequestException(
        'Một hoặc nhiều seat_booking_id không tồn tại',
      );
    }

    const ticketSeatBookings = seatBookings.map((sb) =>
      this.ticketSeatBookingRepository.create({
        ticket: savedTicket,
        seatBooking: sb,
      }),
    );

    await this.ticketSeatBookingRepository.save(ticketSeatBookings);

    // 3. Tạo TicketConcession
    const itemIds = concessions.map((c) => c.item_id);
    const items = await this.concessionItemRepository.find({
      where: {
        id: In(itemIds),
      },
    });

    const ticketConcessions = concessions.map((c) => {
      const item = items.find((i) => i.id === c.item_id);
      if (!item)
        throw new BadRequestException(
          `Không tìm thấy item với id: ${c.item_id}`,
        );

      return this.ticketConcessionRepository.create({
        ticket: savedTicket,
        item,
        quantity: c.quantity,
        total_price: Number(item.price) * c.quantity,
      });
    });

    await this.ticketConcessionRepository.save(ticketConcessions);

    const ticketWithRelations = await this.ticketRepository.findOne({
      where: { id: savedTicket.id },
      relations: [
        'seatBookings',
        'seatBookings.seatBooking',
        'concessions',
        'concessions.item',
      ],
    });

    if (!ticketWithRelations) {
      throw new BadRequestException('Không tìm thấy ticket sau khi tạo');
    }

    return ticketWithRelations;
  }

  async getTicketDetail(ticketId: string): Promise<any> {
    console.log('ticketId', ticketId);
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: [
        'user',
        'seatBookings',
        'seatBookings.seatBooking',
        'seatBookings.seatBooking.seat',
        'concessions',
        'concessions.item',
      ],
    });

    if (!ticket) {
      throw new BadRequestException('Không tìm thấy vé');
    }

    const firstSeatBooking = ticket.seatBookings[0]?.seatBooking;

    const [movie, hall, showtime] = await Promise.all([
      this.movieRepository.findOne({
        where: { id: firstSeatBooking?.movie_id },
      }),
      this.hallRepository.findOne({ where: { id: firstSeatBooking?.hall_id } }),
      this.shownTimeRepository.findOne({
        where: { id: firstSeatBooking?.showtime_id },
      }),
    ]);

    return {
      id: ticket.id,
      user_id: ticket.user?.id,
      seat_total_price: ticket.seat_total_price,
      concession_total_price: ticket.concession_total_price,
      total_price: ticket.total_price,
      movie_id: firstSeatBooking?.movie_id,
      hall_id: firstSeatBooking?.hall_id,
      showtime_id: firstSeatBooking?.showtime_id,
      seats: ticket.seatBookings.map((tsb) => ({
        id: tsb.seatBooking.id,
        seat: tsb.seatBooking.seat,
        status: tsb.seatBooking.status,
      })),
      movie,
      hall,
      showtime,
      concessions: ticket.concessions.map((c) => ({
        item: c.item,
        quantity: c.quantity,
        total_price: c.total_price,
      })),
    };
  }

  async getTicketsByUser(userId: string): Promise<any[]> {
    const tickets = await this.ticketRepository.find({
      where: { user: { id: userId } },
      select: ['id'],
      order: { created_at: 'DESC' },
    });

    const ticketDetails = await Promise.all(
      tickets.map((ticket) => this.getTicketDetail(ticket.id)),
    );

    return ticketDetails;
  }
}
