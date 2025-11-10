import { IsOptional, IsEnum, Min, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ReleaseStatus } from 'src/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetMovieQueryDto {
  @IsOptional()
  @IsEnum(ReleaseStatus)
  @Type(() => String)
  @ApiProperty({
    required: false,
    enum: ReleaseStatus,
    enumName: 'ReleaseStatus',
    description: 'Lọc phim theo trạng thái phát hành',
    example: ReleaseStatus.NOW_SHOWING,
  })
  status?: ReleaseStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1, description: 'Trang hiện tại' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 10, description: 'Số lượng mỗi trang' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Avengers',
    description: 'Tìm kiếm phim theo tên (hỗ trợ tìm kiếm một phần)',
  })
  search?: string;
}
