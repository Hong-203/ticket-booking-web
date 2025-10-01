import { ShownIn } from 'src/shown-in/entities/shown_in.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  movie_start_time: string;

  @Column({ type: 'char', length: 2, nullable: true })
  show_type: string;

  @Column({ type: 'date', nullable: true })
  showtime_date: Date;

  @Column({ type: 'int', nullable: true })
  price_per_seat: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // relation
  @OneToMany(() => ShownIn, (shownIn) => shownIn.movie)
  shownIn: ShownIn[];
}
