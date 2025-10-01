import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Movie } from './entities/movie.entity';

import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieDirector } from './entities/movie_directors.entity';
import { MovieGenre } from './entities/movie_genre.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, MovieDirector, MovieGenre]),
    CloudinaryModule,
  ],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
