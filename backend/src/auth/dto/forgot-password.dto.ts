import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}

export default ForgotPasswordDto;
