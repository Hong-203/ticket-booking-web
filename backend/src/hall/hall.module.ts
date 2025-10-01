import { Module } from '@nestjs/common';
import { HallService } from './hall.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { HallController } from './hall.controller';
import { Seat } from 'src/seat/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hall, Seat])],
  providers: [HallService],
  controllers: [HallController],
})
export class HallModule {}
