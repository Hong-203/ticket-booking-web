import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/configuration';
import { TheatreModule } from './theatre/theatre.module';
import { FeaturesModule } from './features/features.module';
import { HallModule } from './hall/hall.module';
import { SeatModule } from './seat/seat.module';
import { HallwiseSeatModule } from './hallwise-seat/hallwise-seat.module';
import { ShowtimeModule } from './showtimes/showtimes.module';
import { MovieModule } from './movie/movie.module';
import { ShownInModule } from './shown-in/shown-in.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConcessionItemsModule } from './concession-item/concession-item.module';
import { TicketModule } from './ticket/ticket.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đảm bảo module này có thể dùng ở bất cứ đâu
      load: [databaseConfig], // Load file cấu hình bạn đã export
      envFilePath: ['.env'], // hoặc cụ thể: ['.env.dev', '.env.local', v.v.]
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    TheatreModule,
    FeaturesModule,
    HallModule,
    SeatModule,
    HallwiseSeatModule,
    ShowtimeModule,
    MovieModule,
    ShownInModule,
    ScheduleModule.forRoot(),
    ConcessionItemsModule,
    TicketModule,
    PaymentModule,
  ],
})
export class AppModule {}
