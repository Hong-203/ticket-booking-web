import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HallwiseSeatController } from './hallwise-seat.controller';
import { HallwiseSeatService } from './hallwise-seat.service';
import { Hall } from 'src/hall/entities/hall.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hall, Seat])],
  providers: [HallwiseSeatService],
  controllers: [HallwiseSeatController],
})
export class HallwiseSeatModule {}
