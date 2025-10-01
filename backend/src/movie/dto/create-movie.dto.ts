// create-movie.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  language?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  synopsis?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty()
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  duration?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  top_cast?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  release_date?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  trailer_url?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty()
  directors?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty()
  genres?: string[];
}
