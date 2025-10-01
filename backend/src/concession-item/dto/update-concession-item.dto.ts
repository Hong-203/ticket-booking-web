import { PartialType } from '@nestjs/mapped-types';
import { CreateConcessionItemDto } from './create-concession-item.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConcessionCategory } from 'src/constants';

export class UpdateConcessionItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  price: number;

  @IsOptional()
  @ApiProperty()
  @IsEnum(ConcessionCategory)
  category: ConcessionCategory;
}
