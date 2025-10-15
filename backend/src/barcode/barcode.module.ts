import { Module } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barcode } from './entities/barcode.entity';
import { BarcodeController } from './barcode.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Barcode])],
  providers: [BarcodeService, CloudinaryService],
  controllers: [BarcodeController],
  exports: [BarcodeService],
})
export class BarcodeModule {}
