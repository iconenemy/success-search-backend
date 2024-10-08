import { join } from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { CacheModule } from '@libs/common';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule,
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('MAILER_HOST'),
          port: Number(configService.getOrThrow<number>('MAILER_PORT')),
        },
        defaults: {
          from: `"No Reply" <noreply@example.com>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {
  constructor() {
    console.log('Template directory:', join(__dirname, '..', 'templates'));
  }
}
