import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';
import { AccountType, Gender } from 'src/constants';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiProperty()
  full_name?: string;

  @IsOptional()
  @IsString()
  @Length(8, 11)
  @Matches(/^\d+$/, { message: 'phone_number must contain only digits' })
  @ApiProperty()
  phone_number?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  account_balance?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  avatar_url?: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty()
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  dob?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(AccountType)
  @ApiProperty()
  account_type?: AccountType;
}
