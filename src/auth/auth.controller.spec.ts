/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            requestCode: jest.fn(),
            verifyCode: jest.fn().mockResolvedValue({ token: 'test-token' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('requestCode', () => {
    it('should request code', async () => {
      const dto = { email: 'test@example.com' };
      await controller.requestCode(dto);
      expect(service.requestCode).toHaveBeenCalledWith(dto);
    });
  });

  describe('verifyCode', () => {
    it('should verify code and set cookie', async () => {
      const dto = { email: 'test@example.com', code: '123456' };
      const mockJson = jest.fn();
      const res = {
        cookie: jest.fn(),
        json: mockJson,
      } as unknown as Response;

      await controller.verifyCode(dto, res);

      expect(service.verifyCode).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith(
        'auth_token',
        'test-token',
        expect.any(Object),
      );
      expect(mockJson).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('logout', () => {
    it('should clear cookie', () => {
      const res = {
        clearCookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      controller.logout(res);
      expect(res.clearCookie).toHaveBeenCalledWith('auth_token');
    });
  });
});
