import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity('movie_directors')
export class MovieDirector {
  @PrimaryColumn()
  movie_id: string;

  @PrimaryColumn({ type: 'varchar', length: 30 })
  director: string;

  @ManyToOne(() => Movie, (movie) => movie.directors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
