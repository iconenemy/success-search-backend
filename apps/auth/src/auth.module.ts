import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { CacheModule, RabbitMQModule } from '@libs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { AccessJwtStrategy } from './strategies/access.jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh.jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule,
    CacheModule,
    RabbitMQModule.register(['NOTIFICATION_SERVICE', 'USER_SERVICE']),
    PassportModule.register({
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
