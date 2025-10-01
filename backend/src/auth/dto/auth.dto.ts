import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsEmailOrPhone } from 'src/utils/is-email-or-phone.validator';

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString({ message: 'USER::NAME_MUST_BE_STRING' })
  @MaxLength(250, {
    message: 'AUTH::MAX_LENGTH_IS_250',
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  @Validate(IsEmailOrPhone, {
    message: 'Identifier must be a valid email or phone number',
  })
  identifier: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty()
  identifier: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
