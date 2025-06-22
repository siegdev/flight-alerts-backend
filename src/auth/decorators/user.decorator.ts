import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';

export function userFactory(
  data: unknown,
  ctx: ExecutionContext,
): JwtPayload | undefined {
  const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
  return request.user;
}

export const User = createParamDecorator(userFactory);
