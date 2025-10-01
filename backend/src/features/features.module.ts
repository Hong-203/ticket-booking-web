import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './entities/features.entity';
import { Theatre } from 'src/theatre/entities/theatre.entity';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Feature, Theatre])],
  providers: [FeaturesService],
  controllers: [FeaturesController],
})
export class FeaturesModule {}
