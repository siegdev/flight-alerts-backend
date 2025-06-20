import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './types/jwt-payload.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const cookies = req?.cookies as { auth_token?: string } | undefined;
          return cookies?.auth_token ?? null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || 'topSecretKey',
    });
  }

  validate(payload: unknown): JwtPayload {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'email' in payload &&
      typeof payload.email === 'string'
    ) {
      return { email: payload.email };
    }
    throw new Error('Invalid token payload');
  }
}
