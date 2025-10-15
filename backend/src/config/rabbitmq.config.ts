import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';

export const createRabbitClient = (configService: ConfigService) => {
  const RABBIT_URL = configService.get<string>('RABBITMQ_URL')!;
  const QUEUE = configService.get<string>('RABBITMQ_QUEUE') || 'payment_queue';

  const clientOptions: RmqOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [RABBIT_URL],
      queue: QUEUE,
      queueOptions: { durable: true },
    },
  };

  return ClientProxyFactory.create(clientOptions);
};
