import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHallDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  totalSeats?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  theatre?: string;
}
