import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MovieDirector } from './movie_directors.entity';
import { MovieGenre } from './movie_genre.entity';
import { ShownIn } from 'src/shown-in/entities/shown_in.entity';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  image_path: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  language: string;

  @Column({ type: 'text', nullable: true })
  synopsis: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  duration: string;

  @Column({ type: 'text', nullable: true })
  top_cast: string;

  @Column({ type: 'date', nullable: true })
  release_date: Date;

  @Column({ type: 'text', nullable: true })
  trailer_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => MovieDirector, (director) => director.movie, {
    cascade: true,
  })
  directors: MovieDirector[];

  @OneToMany(() => MovieGenre, (genre) => genre.movie, { cascade: true })
  genres: MovieGenre[];

  @OneToMany(() => ShownIn, (shownIn) => shownIn.movie)
  shownIn: ShownIn[];
}
