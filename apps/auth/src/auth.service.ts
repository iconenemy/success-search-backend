import {
  Inject,
  Injectable,
  HttpStatus,
  HttpException,
  ConflictException,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { DTO, Model, Pattern, Type } from '@libs/shared';

import {
  IssueTokenRequest,
  IssueTokenResponse,
} from './types/issue.token.type';
import { SignInRequest, SignInResponse } from './types/sign-in.type';
import { SignUpRequest, SignUpResponse } from './types/sign-up.type';
import {
  VerifyEmailRequest,
  VerifyEmailResponse,
} from './types/verify-email.type';

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

  async signIn(payload: SignInRequest): Promise<SignInResponse> {
    const { email, password } = payload;

    const userCandidate = await lastValueFrom(
      this.userClient.send<Type.FindOneRes<Model.User>, DTO.User.FindOne>(
        { cmd: Pattern.User.FindOne },
        { email },
      ),
    );

    if (!userCandidate) throw new NotFoundException('Hеправильно введені дані');

    const isPasswordMatch = await bcrypt.compare(
      password,
      userCandidate.password,
    );
    if (userCandidate.email !== email || !isPasswordMatch) {
      throw new NotFoundException('Hеправильно введені дані');
    }

    if (!userCandidate.is_verified) {
      const isExistVerifyCode = await this.cacheManager.get(
        userCandidate.email,
      );

      if (!isExistVerifyCode) {
        await firstValueFrom(
          this.notificationClient.send({ cmd: 'notification.' }, {}),
        );
      }

      throw new HttpException(
        'На вашу пошту вже був надісланий лист для підтвердження аккаунту',
        HttpStatus.FORBIDDEN,
      );
    }

    const { refreshToken, accessToken } = await this.issueTokens({
      email,
      id: userCandidate.id,
    });

    return { refreshToken, accessToken, id: userCandidate.id, email };
  }

  async signUp(payload: SignUpRequest): Promise<SignUpResponse> {
    const { email, password } = payload;

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

  async verifyEmail(payload: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const { email } = payload;
    const code = await this.cacheManager.get(email);
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
