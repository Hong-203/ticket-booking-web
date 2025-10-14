import { Module } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  providers: [BarcodeService, CloudinaryService],
  exports: [BarcodeService],
})
export class BarcodeModule {}
