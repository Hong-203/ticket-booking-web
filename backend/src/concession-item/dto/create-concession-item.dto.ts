import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ConcessionCategory } from 'src/constants';

export class CreateConcessionItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image_url?: string;

  @IsEnum(ConcessionCategory)
  @ApiProperty({
    enum: ConcessionCategory,
    enumName: 'ConcessionCategory',
    example: ConcessionCategory.DRINK,
    description: 'Phân loại: drink, snack hoặc combo',
  })
  category: ConcessionCategory;
}
