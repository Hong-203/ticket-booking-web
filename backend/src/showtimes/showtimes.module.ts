import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtimes.entity';
import { ShowtimeService } from './showtimes.service';
import { ShowtimeController } from './showtimes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime])],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
})
export class ShowtimeModule {}
