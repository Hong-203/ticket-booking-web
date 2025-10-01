import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShownInController } from './shown-in.controller';
import { ShownInService } from './shown-in.service';
import { ShownIn } from './entities/shown_in.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Hall } from 'src/hall/entities/hall.entity';
import { Showtime } from 'src/showtimes/entities/showtimes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShownIn, Movie, Hall, Showtime])],
  providers: [ShownInService],
  controllers: [ShownInController],
  exports: [ShownInService, TypeOrmModule],
})
export class ShownInModule {}
