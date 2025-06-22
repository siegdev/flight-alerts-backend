/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            authCode: {
              create: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('requestCode', () => {
    it('should create auth code', async () => {
      const dto = { email: 'test@example.com' };
      await service.requestCode(dto);
      expect(prisma.authCode.create).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const dto = { email: 'test@example.com' };
      jest
        .spyOn(prisma.authCode, 'create')
        .mockRejectedValueOnce(new Error('DB Error'));
      await expect(service.requestCode(dto)).rejects.toThrow();
    });

    it('should handle string error', async () => {
      const dto = { email: 'test@example.com' };
      jest
        .spyOn(prisma.authCode, 'create')
        .mockRejectedValueOnce('string error');
      await expect(service.requestCode(dto)).rejects.toThrow();
    });

    it('should handle unknown error type', async () => {
      const dto = { email: 'test@example.com' };
      jest.spyOn(prisma.authCode, 'create').mockRejectedValueOnce(12345);
      await expect(service.requestCode(dto)).rejects.toThrow();
    });
  });

  describe('verifyCode', () => {
    const mockCode = {
      id: '1',
      email: 'test@example.com',
      code: '123456',
      expiresAt: new Date(Date.now() + 1000 * 60),
      createdAt: new Date(),
    };

    it('should verify valid code', async () => {
      const dto = { email: 'test@example.com', code: '123456' };
      jest.spyOn(prisma.authCode, 'findFirst').mockResolvedValueOnce(mockCode);
      const result = await service.verifyCode(dto);
      expect(result).toHaveProperty('token');
    });

    it('should throw on invalid code', async () => {
      const dto = { email: 'test@example.com', code: 'wrong' };
      jest.spyOn(prisma.authCode, 'findFirst').mockResolvedValueOnce(null);
      await expect(service.verifyCode(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
