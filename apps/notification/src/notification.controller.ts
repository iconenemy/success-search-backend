import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { DTO, Pattern } from '@libs/shared';

import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: Pattern.Notification.SendCode })
  async sendVerificationCode(@Payload() dto: DTO.Notification.SendCode) {
    this.notificationService.sendNotificationCode(dto);
  }
}
