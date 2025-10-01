import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
import { ShownIn } from 'src/shown-in/entities/shown_in.entity';
import { SeatBookingStatus } from 'src/constants';
import { User } from 'src/users/entities/user.entity';

@Index(['movie_id', 'hall_id', 'showtime_id', 'seat_id'], { unique: true })
@Entity('seat_booking')
export class SeatBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Seat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @ManyToOne(() => ShownIn, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'movie_id', referencedColumnName: 'movie_id' },
    { name: 'hall_id', referencedColumnName: 'hall_id' },
    { name: 'showtime_id', referencedColumnName: 'showtime_id' },
  ])
  shownIn: ShownIn;

  @Column({ length: 36 })
  movie_id: string;

  @Column({ length: 36 })
  hall_id: string;

  @Column({ length: 36 })
  showtime_id: string;

  @Column({ length: 36 })
  seat_id: string;

  @Column({
    type: 'enum',
    enum: SeatBookingStatus,
    default: SeatBookingStatus.Empty,
  })
  status: SeatBookingStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relation
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 36 })
  user_id: string;
}
