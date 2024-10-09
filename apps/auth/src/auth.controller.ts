import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Pattern, DTO } from '@libs/shared';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: Pattern.Auth.SignIn })
  async signIn(@Payload() dto: DTO.Auth.SignIn) {
    return this.authService.signIn(dto);
  }

  @MessagePattern({ cmd: Pattern.Auth.SignUp })
  async signUp(@Payload() dto: DTO.Auth.SignUp) {
    return this.authService.signUp(dto);
  }

  @MessagePattern({ cmd: Pattern.Auth.VerifyEmail })
  async verifyEmail(@Payload() dto: DTO.Notification.VerifyEmail) {
    return this.authService.verifyEmail(dto);
  }

  @MessagePattern({ cmd: Pattern.Auth.VerifyAccess })
  async verifyAccess(@Payload() dto: DTO.Auth.VerifyAccess) {
    return this.authService.verifyAccess(dto);
  }
}
