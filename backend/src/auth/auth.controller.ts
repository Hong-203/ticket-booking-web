import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('ók');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!result || !result.token) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent('Google login failed')}`,
      );
    }

    return res.redirect(`${frontendUrl}/auth-success?token=${result.token}`);
  }
}
