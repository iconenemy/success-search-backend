import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule, RabbitMQModule } from '@libs/common';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [],
})
export class GatewayModule {}
