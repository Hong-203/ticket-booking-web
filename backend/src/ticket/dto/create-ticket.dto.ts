import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ConcessionDto {
  @IsString()
  @ApiProperty({ example: 'item-uuid-123' })
  item_id: string;

  @IsNumber()
  @ApiProperty({ example: 2 })
  quantity: number;
}

export class CreateTicketDto {
  @IsNumber()
  @ApiProperty({ example: 50000 })
  seat_total_price: number;

  @IsNumber()
  @ApiProperty({ example: 30000 })
  concession_total_price: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['seat-booking-id-1', 'seat-booking-id-2'],
    type: [String],
  })
  seat_booking_ids: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConcessionDto)
  @ApiProperty({
    type: [ConcessionDto],
    example: [
      {
        item_id: 'concession-item-uuid-1',
        quantity: 2,
      },
      {
        item_id: 'concession-item-uuid-2',
        quantity: 1,
      },
    ],
  })
  concessions: ConcessionDto[];
}
