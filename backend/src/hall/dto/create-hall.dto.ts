import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateHallDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  totalSeats?: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  theatre: string;
}
