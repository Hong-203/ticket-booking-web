import { SeatBooking } from 'src/seat/entities/seat_booking.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket_seat_booking')
export class TicketSeatBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.seatBookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => SeatBooking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_booking_id' })
  seatBooking: SeatBooking;
}
