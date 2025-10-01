import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login and receive JWT token' })
  async login(@Body() loginDto: LoginDto) {
    console.log('loginDto', loginDto);
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user by email or phone' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: User,
  })
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    console.log('registerDto', registerDto);
    return this.authService.register(registerDto);
  }
}
