import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule as CacheManager } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheManager.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: Number(configService.get<string>('REDIS_PORT')),
          },
          ttl: Number(configService.get('REDIS_TTL')),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
          database: 0,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheManager],
})
export class CacheModule {}
