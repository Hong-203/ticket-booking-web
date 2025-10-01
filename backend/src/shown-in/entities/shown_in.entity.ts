import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';

@Index(['movie_id', 'hall_id', 'showtime_id'], { unique: true })
@Entity('shown_in')
export class ShownIn {
  @PrimaryColumn()
  movie_id: string;

  @PrimaryColumn()
  showtime_id: string;

  @PrimaryColumn()
  hall_id: string;

  @ManyToOne(() => Movie, (movie) => movie.shownIn, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Showtime, (showtime) => showtime.shownIn, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;

  @ManyToOne(() => Hall, (hall) => hall.shownIn, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
