import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketSeatBooking } from './TicketSeatBooking.entity';
import { TicketConcession } from './TicketConcession.entity';
import { TicketStatus } from 'src/constants';
import { Barcode } from 'src/barcode/entities/barcode.entity';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Tổng giá ghế (sum của tất cả SeatBooking)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  seat_total_price: number;

  // Tổng giá đồ ăn (sum của tất cả Concessions)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  concession_total_price: number;

  // Tổng cuối cùng = seat_total_price + concession_total_price
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_price: number;

  // ✅ Thêm status
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relations
  @OneToMany(() => TicketSeatBooking, (tsb) => tsb.ticket, { cascade: true })
  seatBookings: TicketSeatBooking[];

  @OneToMany(() => TicketConcession, (tc) => tc.ticket, { cascade: true })
  concessions: TicketConcession[];

  @OneToOne(() => Barcode, (barcode) => barcode.ticket, { cascade: true })
  barcode: Barcode;
}
