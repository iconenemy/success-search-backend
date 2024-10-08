import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
