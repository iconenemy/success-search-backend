import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RmqOptions } from '@nestjs/microservices';

import { RabbitMQService } from '@libs/common';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Connect and Run Microservice(s)
  const configService = app.get(ConfigService);
  const rabbitMQService = new RabbitMQService(configService);
  app.connectMicroservice<RmqOptions>(rabbitMQService.getOptions('auth'));
  await app.startAllMicroservices();
}

bootstrap();
