import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import { RabbitMQService } from '@libs/common';

import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  // Connect and Run Microservice(s)
  const configService = app.get(ConfigService);
  const rabbitMQService = new RabbitMQService(configService);
  app.connectMicroservice<RmqOptions>(
    rabbitMQService.getOptions('notification'),
  );
  await app.startAllMicroservices();
}
bootstrap();
