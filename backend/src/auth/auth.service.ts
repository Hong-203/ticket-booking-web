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
import { randomBytes } from 'crypto';
import { MailerService } from 'src/mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Khởi tạo Logger

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
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
      console.log('password', password);
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

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại trong hệ thống');
    }

    const newPassword = randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const id = user.id;
    await this.usersService.updatePassword(id, hashedPassword);

    await this.mailerService.sendMail(
      email,
      'Mật khẩu mới của bạn',
      `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7fafc; border-radius: 8px;">
        <div style="background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h2 style="color: #2d3748;">Xin chào ${user.full_name},</h2>
          <p style="color: #4a5568; font-size: 16px;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn.</p>
          <p style="color: #4a5568; font-size: 16px;">Mật khẩu mới của bạn là:</p>
          <div style="padding: 15px; background-color: #edf2f7; border-radius: 6px; text-align: center;">
            <span style="font-size: 20px; font-weight: bold; color: #2d3748;">${newPassword}</span>
          </div>
          <p style="color: #4a5568; font-size: 16px; margin-top: 20px;">Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập để đảm bảo bảo mật.</p>
          <p style="color: #4a5568; font-size: 16px;">Nếu bạn không yêu cầu điều này, hãy bỏ qua email.</p>
          <p style="margin-top: 30px; color: #718096;">Trân trọng,<br /><strong>Đội ngũ hỗ trợ</strong></p>
        </div>
        <p style="font-size: 12px; color: #a0aec0; text-align: center; margin-top: 20px;">
          Đây là email tự động. Vui lòng không trả lời email này.
        </p>
      </div>
      `,
    );

    return { message: 'Mật khẩu mới đã được gửi đến email của bạn' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword } = dto;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await this.usersService.updatePassword(userId, hashed);

    return { message: 'Đổi mật khẩu thành công' };
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
