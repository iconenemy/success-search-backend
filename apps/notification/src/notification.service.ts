import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { DTO } from '@libs/shared';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async sendNotificationCode(dto: DTO.Notification.SendCode) {
    const { email } = dto;

    const verificationCode = this.generateCode();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Talent hub! Confirm your Email',
      template: './verification',
      context: {
        code: verificationCode,
      },
    });

    await this.cacheManager.set(email, verificationCode);
  }

  private generateCode() {
    return Math.floor(10000 + Math.random() * 90000);
  }
}
