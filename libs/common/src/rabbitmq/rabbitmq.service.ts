import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export class RabbitMQService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck: boolean = true): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URI')],
        queue,
        noAck,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
