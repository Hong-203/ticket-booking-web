import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateSeatDto } from './create-seat.dto';

export class BulkCreateSeatDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSeatDto)
  seats: CreateSeatDto[];
}
