// src/seat/dto/update-seat.dto.ts
import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSeatDto {
  @IsOptional()
  @IsString()
  @Length(1, 3)
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
