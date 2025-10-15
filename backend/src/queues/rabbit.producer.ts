import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import {
  CreatePaymentMoMoDto,
  CreatePaymentZaloPayDto,
} from 'src/payment/dto/create-momo.dto';

@Injectable()
export class RabbitProducer implements OnModuleInit {
  private readonly logger = new Logger(RabbitProducer.name);
  private channel: amqp.Channel;

  async onModuleInit() {
    const url =
      process.env.RABBITMQ_URL ||
      'amqps://glllkfmy:drWoWlZYu4u4QRU3tHVsbcSJ8swW7sxB@gorilla.lmq.cloudamqp.com/glllkfmy';
    const conn = await amqp.connect(url);
    this.channel = await conn.createChannel();

    await this.channel.assertQueue('momoQueue', { durable: true });
    await this.channel.assertQueue('zaloQueue', { durable: true });

    this.logger.log('🐇 Connected to RabbitMQ producer');
  }

  async publishCreateMoMo(dto: CreatePaymentMoMoDto) {
    this.logger.log(`📤 Sending to momoQueue`);
    this.channel.sendToQueue('momoQueue', Buffer.from(JSON.stringify(dto)), {
      persistent: true,
    });
  }

  async publishCreateZaloPay(dto: CreatePaymentZaloPayDto) {
    this.logger.log(`📤 Sending to zaloQueue`);
    this.channel.sendToQueue('zaloQueue', Buffer.from(JSON.stringify(dto)), {
      persistent: true,
    });
  }
}
