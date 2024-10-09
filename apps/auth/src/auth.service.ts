import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { DTO, Model, Pattern, Type } from '@libs/shared';

import {
  IssueTokenRequest,
  IssueTokenResponse,
} from './types/issue.token.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(dto: DTO.Auth.SignIn) {
    const { email, password } = dto;
    const userCandidate = await lastValueFrom(
      this.userClient.send<Type.FindOneRes<Model.User>, DTO.User.FindOne>(
        { cmd: Pattern.User.FindOne },
        { email },
      ),
    );

    if (!userCandidate)
      throw new NotFoundException(
        'Incorrect email or password. Please try again.',
      );

    const isPasswordMatch = await bcrypt.compare(
      password,
      userCandidate.password,
    );
    if (userCandidate.email !== email || !isPasswordMatch) {
      throw new NotFoundException(
        'Incorrect email or password. Please try again.',
      );
    }

    if (!userCandidate.is_verified) {
      const isExistCode = await this.cacheManager.get(email);

      if (!isExistCode)
        await lastValueFrom(
          this.notificationClient.send(
            { cmd: Pattern.Notification.SendCode },
            { email },
          ),
        );
    }

    const { refreshToken, accessToken } = await this.issueTokens({
      email,
      id: userCandidate.id,
    });

    return {
      refreshToken,
      accessToken,
      id: userCandidate.id,
      email,
      is_verified: userCandidate.is_verified,
    };
  }

  async signUp(dto: DTO.Auth.SignUp) {
    const { email, password } = dto;

    const userCandidate = await lastValueFrom(
      this.userClient.send<Type.FindOneRes<Model.User>, DTO.User.FindOne>(
        { cmd: Pattern.User.FindOne },
        { email },
      ),
    );

    if (userCandidate)
      throw new ConflictException('User with such email already exists');

    const userRecord = await lastValueFrom(
      this.userClient.send({ cmd: Pattern.User.Create }, { email, password }),
    );

    if (!userRecord) throw new NotAcceptableException('Can not create user');

    return { success: true };
  }

  async verifyEmail(dto: DTO.Notification.VerifyEmail) {
    const { email, code, id } = dto;

    const cacheCode = await this.cacheManager.get(email);
    
    if (code !== cacheCode) {
      throw new BadRequestException('Invalid verification code');
    }

    await Promise.all([
      this.cacheManager.del(email),
      firstValueFrom(
        this.userClient.send(
          { cmd: Pattern.User.Update },
          { id, is_verified: true },
        ),
      ),
    ]);

    return { success: true };
  }

  async verifyAccess(payload: DTO.Auth.VerifyAccess): Promise<any> {
    const { accessToken } = payload;

    return this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.getOrThrow<string>('ACCESS_JWT_SECRET'),
    });
  }

  private async issueTokens(
    payload: IssueTokenRequest,
  ): Promise<IssueTokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('ACCESS_JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('ACCESS_JWT_EXPIRE'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('REFRESH_JWT_EXPIRE'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
