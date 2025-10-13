import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, JwtStrategy, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}
