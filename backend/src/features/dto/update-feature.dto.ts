import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureDto } from './create-feature.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFeatureDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  theatreId: string;
}
