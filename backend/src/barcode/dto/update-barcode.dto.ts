import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBarcodeStatusDto {
  @IsEnum(['ACTIVE', 'USED', 'EXPIRED'], {
    message: 'Status must be ACTIVE, USED, or EXPIRED',
  })
  @IsNotEmpty()
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
}
