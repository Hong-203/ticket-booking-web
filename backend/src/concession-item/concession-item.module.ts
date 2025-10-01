import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcessionItemsService } from './concession-item.service';
import { ConcessionItem } from './entities/concession-item.entity';
import { ConcessionItemsController } from './concession-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConcessionItem])],
  providers: [ConcessionItemsService],
  controllers: [ConcessionItemsController],
})
export class ConcessionItemsModule {}
