import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Theatre } from 'src/theatre/entities/theatre.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { ShownIn } from 'src/shown-in/entities/shown_in.entity';

@Entity('hall')
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  name: string;

  @Column({ type: 'int', nullable: true, name: 'total_seats' })
  totalSeats: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relation
  @ManyToOne(() => Theatre, (theatre) => theatre.halls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'theatre_id' })
  theatre: Theatre;

  @ManyToMany(() => Seat, (seat) => seat.halls, { cascade: true })
  @JoinTable({
    name: 'hallwise_seat',
    joinColumn: { name: 'hall_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'seat_id', referencedColumnName: 'id' },
  })
  seats: Seat[];

  @OneToMany(() => ShownIn, (shownIn) => shownIn.movie)
  shownIn: ShownIn[];
}
