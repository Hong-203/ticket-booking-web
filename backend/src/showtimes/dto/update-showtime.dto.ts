import { PartialType } from '@nestjs/mapped-types';
import { CreateShowtimeDto } from './create-showtime.dto';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShowtimeDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  movie_start_time?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  show_type?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  showtime_date?: Date;

  @IsOptional()
  @ApiProperty()
  @IsInt()
  price_per_seat?: number;
}
