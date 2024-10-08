import { Module } from '@nestjs/common';

import { RabbitMQModule } from '@libs/common';

import { AuthController } from './auth.controller';

@Module({
  imports: [RabbitMQModule.register(['AUTH_SERVICE'])],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
