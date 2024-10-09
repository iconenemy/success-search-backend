import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Post,
  Body,
  Patch,
  Inject,
  Request,
  UseGuards,
  Controller,
  Get,
} from '@nestjs/common';

import { AccessAuthGuard, Decorator, DTO, Pattern } from '@libs/shared';
import { firstValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
@ApiResponse({
  status: 201,
  description: 'Success sign up',
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class AuthController {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('sign-in')
  async signIn(@Body() dto: DTO.Auth.SignIn) {
    return this.authClient.send({ cmd: Pattern.Auth.SignIn }, dto);
  }

  @Post('sign-up')
  async signUp(@Body() dto: DTO.Auth.SignUp) {
    return this.authClient.send({ cmd: Pattern.Auth.SignUp }, dto);
  }

  @UseGuards(AccessAuthGuard)
  @Patch('verify-email')
  async verifyEmail(@Decorator.User() user, @Body() dto: DTO.Auth.VerifyEmail) {
    return this.authClient.send(
      { cmd: Pattern.Auth.VerifyEmail },
      { email: user.email, id: user.id, code: dto.code },
    );
  }
}
