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

import { AccessAuthGuard, DTO, Pattern } from '@libs/shared';

@ApiTags('Auth')
@Controller('auth')
@ApiResponse({
  status: 201,
  description: 'Success sign up',
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('sign-in')
  async signIn(@Body() dto: DTO.Auth.SignIn) {
    return this.authClient.send({ cmd: Pattern.Auth.SignIn }, dto);
  }

  @Post('sign-up')
  async signUp(@Body() dto: DTO.Auth.SignUp) {
    return this.authClient.send({ cmd: Pattern.Auth.SignIn }, dto);
  }

  @UseGuards(AccessAuthGuard)
  @Patch('verify-email')
  async verifyEmail(@Request() req, @Body() dto: DTO.Auth.VerifyEmail) {
    const { user } = req;
    console.log('USER: ', user);

    const { email } = dto;
    return this.authClient.send({ cmd: 'auth.verifyEmail' }, { email });
  }
}
