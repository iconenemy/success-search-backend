import { Controller, Get, Render } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern({ cmd: 'notification.sendCode' })
  async sendVerificationCode(@Payload() dto) {
    this.notificationService.sendNotificationCode(dto);
  }
}
