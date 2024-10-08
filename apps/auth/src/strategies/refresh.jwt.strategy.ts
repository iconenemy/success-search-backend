import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: RequestType, payload) {
    const { refresh_token } = req.cookies;
    return { ...payload, refresh_token };
  }

  private static extractJWT(req: RequestType): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token;
    }
    return null;
  }
}
