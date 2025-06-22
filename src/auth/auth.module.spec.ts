/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AuthModule', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should use JWT secret from environment variable', async () => {
    process.env.JWT_SECRET = 'test-secret-env';

    const { AuthModule } = await import('./auth.module');

    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
      ],
    }).compile();

    const jwtService = module.get<JwtService>(JwtService);
    const token = jwtService.sign({ foo: 'bar' });

    expect(() =>
      jwtService.verify(token, { secret: 'test-secret-env' }),
    ).not.toThrow();
    expect(() =>
      jwtService.verify(token, { secret: 'topSecretKey' }),
    ).toThrow();
  });

  it('should use default JWT secret if env is not set', async () => {
    delete process.env.JWT_SECRET;

    const { AuthModule } = await import('./auth.module');

    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'topSecretKey',
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
      ],
    }).compile();

    const jwtService = module.get<JwtService>(JwtService);
    const token = jwtService.sign({ foo: 'bar' });

    expect(() =>
      jwtService.verify(token, { secret: 'topSecretKey' }),
    ).not.toThrow();
    expect(() =>
      jwtService.verify(token, { secret: 'test-secret-env' }),
    ).toThrow();
  });
});
