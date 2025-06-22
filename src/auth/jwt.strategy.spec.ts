/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

jest.mock('passport-jwt', () => {
  function MockStrategy(...args: any[]) {
    this.name = 'jwt';
    this.authenticate = jest.fn();
  }
  return {
    Strategy: MockStrategy,
    ExtractJwt: {
      fromExtractors: jest.fn((extractors) => {
        return (request: Request) => {
          for (const extractor of extractors) {
            const token = extractor(request);
            if (token) {
              return token;
            }
          }
          return null;
        };
      }),
    },
  };
});

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('constructor', () => {
    it('should extract token from cookies', () => {
      const mockRequest = {
        cookies: {
          auth_token: 'test-token',
        },
      } as Request;

      const extractors = (ExtractJwt as any).fromExtractors.mock.calls[0][0];
      const extractor = extractors[0];

      const result = extractor(mockRequest);
      expect(result).toBe('test-token');
    });

    it('should handle missing cookies', () => {
      const mockRequest = {} as Request;

      const extractors = (ExtractJwt as any).fromExtractors.mock.calls[0][0];
      const extractor = extractors[0];

      const result = extractor(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('validate', () => {
    it('should validate and return email from payload', () => {
      const payload = { email: 'test@example.com' };
      expect(strategy.validate(payload)).toEqual({ email: 'test@example.com' });
    });

    it('should throw UnauthorizedException for invalid payload', () => {
      const invalidPayload = { foo: 'bar' };
      expect(() => strategy.validate(invalidPayload)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for null payload', () => {
      expect(() => strategy.validate(null)).toThrow(UnauthorizedException);
    });
  });
});
