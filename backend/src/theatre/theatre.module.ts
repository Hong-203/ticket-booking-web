import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theatre } from './entities/theatre.entity';
import { TheatreController } from './theatre.controller';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { TheatreService } from './theatre.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theatre])],
  controllers: [TheatreController],
  providers: [TheatreService, ConfigService, JwtStrategy],
  exports: [TheatreService],
})
export class TheatreModule {}
