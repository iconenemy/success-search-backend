import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Model } from '@libs/shared';
import { DatabaseModule, RabbitMQModule } from '@libs/common';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Model.User]),
    RabbitMQModule.register(['USER_SERVICE']),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
