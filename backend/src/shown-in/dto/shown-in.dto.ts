import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ShownInDto {
  @IsUUID()
  @ApiProperty()
  movie_id: string;

  @IsUUID()
  @ApiProperty()
  showtime_id: string;

  @IsUUID()
  @ApiProperty()
  hall_id: string;
}
