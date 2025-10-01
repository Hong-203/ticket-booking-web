import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetShownInQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  movie_id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  slug_name?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  hall_id?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  showtime_id?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  theatre_id?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: '2025-06-04', description: 'Ngày chiếu' })
  showtime_date?: string;
}
