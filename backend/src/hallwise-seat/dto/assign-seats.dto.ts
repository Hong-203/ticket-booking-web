import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignSeatsDto {
  @ApiProperty()
  @IsString()
  hallId: string;
}
