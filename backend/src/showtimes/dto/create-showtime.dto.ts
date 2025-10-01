import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateShowtimeDto {
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
