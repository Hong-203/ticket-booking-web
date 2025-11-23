import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class GetAvailableSeatsDto {
  @IsString() // Explicitly validate UUID version 4
  @ApiProperty({ description: 'Movie ID in UUID format' })
  movie_id: string;

  @IsUUID('4')
  @ApiProperty({ description: 'Hall ID in UUID format' })
  hall_id: string;

  @IsUUID('4')
  @ApiProperty({ description: 'Showtime ID in UUID format' })
  showtime_id: string;
}
