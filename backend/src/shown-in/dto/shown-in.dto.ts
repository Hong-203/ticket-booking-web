import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ShownInDto {
  @IsString()
  @ApiProperty()
  movie_id: string;

  @IsUUID()
  @ApiProperty()
  showtime_id: string;

  @IsUUID()
  @ApiProperty()
  hall_id: string;
}
