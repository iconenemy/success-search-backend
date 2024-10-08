import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Pattern, DTO } from '@libs/shared';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: Pattern.Auth.SignIn })
  async signIn(@Payload() payload: DTO.Auth.SignIn) {
    return this.authService.signIn(payload);
  }

  @MessagePattern({ cmd: Pattern.Auth.SignUp })
  async signUp(@Payload() payload: DTO.Auth.SignUp) {
    return this.authService.signUp(payload);
  }

  @MessagePattern({ cmd: Pattern.Auth.VerifyEmail })
  async verifyEmail(@Payload() payload: DTO.Auth.VerifyEmail) {
    return this.authService.verifyEmail(payload);
  }

  @MessagePattern({ cmd: Pattern.Auth.VerifyAccess })
  async verifyAccess(@Payload() payload: DTO.Auth.VerifyAccess) {
    return this.authService.verifyAccess(payload);
  }
}
