import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { SeatStatus } from 'src/constants';
import { ApiProperty } from '@nestjs/swagger';

export class QuerySeatsDto {
  @IsOptional()
  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SeatStatus, { message: 'status must be either booked or empty' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  status?: SeatStatus;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;
}
