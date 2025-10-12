import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException, // Import thêm InternalServerErrorException
  Logger, // Import Logger
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs'; // Đảm bảo import đúng
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AccountType } from 'src/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Khởi tạo Logger

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmail = emailRegex.test(identifier); // Biến này không được sử dụng, có thể bỏ qua

    // Giả định rằng bạn luôn tìm kiếm bằng phone_number trong hàm login này
    const user = isEmail
      ? await this.usersService.findByEmail(identifier)
      : await this.usersService.findByPhone(identifier);

    // Kiểm tra người dùng và mật khẩu hash
    if (!user || !user.password) {
      this.logger.warn(
        `Login failed: User not found or password missing for identifier ${identifier}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    let isPasswordValid: boolean;
    try {
      // DEBUG: Kiểm tra kiểu dữ liệu của password và user.password
      this.logger.debug(
        `Type of plain password: ${typeof password}, value: ${password}`,
      );
      this.logger.debug(
        `Type of hashed password: ${typeof user.password}, value: ${user.password}`,
      );

      isPasswordValid = await bcrypt.compare(password, user.password);
      this.logger.debug(`Password comparison result: ${isPasswordValid}`);
    } catch (bcryptError) {
      // Rất quan trọng: Bắt lỗi từ bcrypt.compare
      this.logger.error(
        `Bcrypt comparison error for user ${identifier}: ${bcryptError.message}`,
        bcryptError.stack,
      );
      // Ném ra lỗi server nội bộ vì đây là lỗi không mong muốn của hệ thống
      throw new InternalServerErrorException(
        'Password comparison failed unexpectedly.',
      );
    }

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user ${identifier}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // DEBUG: Kiểm tra payload trước khi ký
    const payload = {
      sub: user.id, // Đảm bảo user.id có giá trị hợp lệ (UUID hoặc number)
      email: user.email,
      phone: user.phone_number,
      role: user.account_type,
    };
    this.logger.debug(`JWT Payload: ${JSON.stringify(payload)}`);

    try {
      const accessToken = this.jwtService.sign(payload);
      return {
        id: user.id,
        username: user.full_name,
        role: user.account_type,
        email: user.email,
        phone: user.phone_number,
        token: accessToken,
      };
    } catch (jwtSignError) {
      this.logger.error(
        `Error signing JWT for user ${identifier}: ${jwtSignError.message}`,
        jwtSignError.stack,
      );
      throw new InternalServerErrorException(
        'Failed to generate authentication token.',
      );
    }
  }

  // Phương thức register không thay đổi, nó đã có try-catch tốt
  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { identifier, password, username } = registerDto;
      const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(identifier);

      const existingUser = isEmail
        ? await this.usersService.findByEmail(identifier)
        : await this.usersService.findByPhone(identifier);

      if (existingUser) {
        throw new BadRequestException('Email or phone number already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.usersService.create({
        ...(isEmail ? { email: identifier } : { phone_number: identifier }),
        password: hashedPassword,
        full_name: username,
      });

      return newUser;
    } catch (error) {
      this.logger.error('Register error:', error); // Sử dụng logger
      throw error;
    }
  }

  // ==========================================
  // 3️⃣ GOOGLE LOGIN (Chuẩn format)
  // ==========================================
  async googleLogin(req: any) {
    if (!req.user) {
      this.logger.warn('Google login failed: no user from Google');
      throw new UnauthorizedException('No user data from Google');
    }

    const { email, username } = req.user;

    let user = await this.usersService.findByEmail(email);
    this.logger.debug('user', user);
    // Nếu user chưa tồn tại → tạo mới
    if (!user) {
      this.logger.log(`Creating new user from Google: ${email}`);

      user = await this.usersService.create({
        email,
        full_name: username,
        password: '', // Không có password vì đăng nhập bằng Google
        account_type: AccountType.Customer,
        is_active: true,
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone_number || null,
      role: user.account_type,
    };

    this.logger.debug(`JWT Payload (Google Login): ${JSON.stringify(payload)}`);

    try {
      const token = this.jwtService.sign(payload);

      return {
        id: user.id,
        username: user.full_name,
        role: user.account_type,
        email: user.email,
        phone: user.phone_number || null,
        token,
      };
    } catch (error) {
      this.logger.error(
        `Error signing JWT for Google user ${email}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to generate token.');
    }
  }
}
