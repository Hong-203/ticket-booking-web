import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateSeatBookingDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  @ApiProperty({ type: [String] })
  seat_ids: string[];

  @IsUUID()
  @ApiProperty()
  movie_id: string;

  @IsUUID()
  @ApiProperty()
  hall_id: string;

  @IsUUID()
  @ApiProperty()
  showtime_id: string;
}
