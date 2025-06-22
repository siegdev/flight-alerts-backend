import { ExecutionContext } from '@nestjs/common';
import { userFactory } from './user.decorator';
import { JwtPayload } from '../types/jwt-payload.type';

describe('userFactory', () => {
  it('should extract user from request', () => {
    const mockUser: JwtPayload = { email: 'test@example.com' };
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as ExecutionContext;

    const result = userFactory(null, mockExecutionContext);

    expect(result).toEqual(mockUser);
  });

  it('should handle missing user', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    const result = userFactory(null, mockExecutionContext);

    expect(result).toBeUndefined();
  });
});
