import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum BarcodeStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

export class CreateBarcodeDto {
  @ApiProperty({
    description: 'Đường dẫn ảnh barcode trên Cloudinary',
    example: 'https://res.cloudinary.com/.../barcode.png',
  })
  @IsString()
  @IsNotEmpty()
  barcodeUrl: string;

  @ApiProperty({
    description: 'Mã code ngắn hiển thị dưới barcode',
    example: 'a3f91d2b7e',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'Trạng thái mã barcode',
    enum: BarcodeStatus,
    default: BarcodeStatus.ACTIVE,
  })
  @IsEnum(BarcodeStatus)
  @IsOptional()
  status?: BarcodeStatus = BarcodeStatus.ACTIVE;

  @ApiPropertyOptional({
    description: 'ID của vé (Ticket) liên kết với barcode',
    example: 'd5c92d83-6d27-4d40-91b3-4de27f5d0182',
  })
  @IsUUID()
  @IsOptional()
  ticketId?: string;
}
