import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitProducer } from './rabbit.producer';
import { PaymentModule } from 'src/payment/payment.module';
import { RabbitMQConsumer } from './rabbit.consumer';

@Module({
  imports: [ConfigModule, forwardRef(() => PaymentModule)],
  providers: [RabbitProducer, RabbitMQConsumer],
  exports: [RabbitProducer],
})
export class RabbitMQModule {}
