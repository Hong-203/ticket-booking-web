import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  constructor(private readonly paymentService: PaymentService) {}

  async onModuleInit() {
    const url =
      process.env.RABBITMQ_URL ||
      'amqps://glllkfmy:drWoWlZYu4u4QRU3tHVsbcSJ8swW7sxB@gorilla.lmq.cloudamqp.com/glllkfmy';
    const momoQueue = 'momoQueue';
    const zaloQueue = 'zaloQueue';

    try {
      const conn = await amqp.connect(url);
      const channel = await conn.createChannel();

      this.logger.log(`🐇 Connected to RabbitMQ`);
      this.logger.log(`Listening on queues: ${momoQueue}, ${zaloQueue}`);

      // Momo
      const momoChannel = await conn.createChannel();
      await momoChannel.assertQueue(momoQueue, { durable: true });
      momoChannel.consume(momoQueue, async (msg) => {
        if (msg) {
          const dto = JSON.parse(msg.content.toString());
          this.logger.log(`📩 Received message from momoQueue`);
          await this.paymentService.savePendingTransaction(dto.ticketId);
          momoChannel.ack(msg);
        }
      });

      // ZaloPay
      const zaloChannel = await conn.createChannel();
      await zaloChannel.assertQueue(zaloQueue, { durable: true });
      zaloChannel.consume(zaloQueue, async (msg) => {
        if (msg) {
          const dto = JSON.parse(msg.content.toString());
          this.logger.log(`📩 Received message from zaloQueue`);

          await this.paymentService.savePendingTransaction(dto.ticketId);

          zaloChannel.ack(msg);
        }
      });
    } catch (err) {
      this.logger.error('❌ Failed to connect to RabbitMQ', err);
    }
  }
}
