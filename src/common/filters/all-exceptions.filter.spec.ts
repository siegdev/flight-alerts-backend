/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppLogger } from '../logger/logger.service';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let logger: AppLogger;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: AppLogger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    logger = module.get<AppLogger>(AppLogger);
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    const mockJson = jest.fn();
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: mockJson,
        }),
        getRequest: () => ({
          url: '/test',
        }),
      }),
    } as ArgumentsHost;

    filter.catch(exception, host);

    expect(logger.error).toHaveBeenCalled();
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Test error',
      }),
    );
  });

  it('should handle unknown errors', () => {
    const exception = 12345;
    const mockJson = jest.fn();
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: mockJson,
        }),
        getRequest: () => ({
          url: '/test',
        }),
      }),
    } as ArgumentsHost;

    filter.catch(exception, host);

    expect(logger.error).toHaveBeenCalled();
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test',
      error: 'Internal server error',
    });
  });

  it('should handle string error', () => {
    const exception = 'string error';
    const mockJson = jest.fn();
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: mockJson,
        }),
        getRequest: () => ({
          url: '/test',
        }),
      }),
    } as any;

    filter.catch(exception, host);

    expect(logger.error).toHaveBeenCalled();
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        error: 'string error',
      }),
    );
  });

  it('should handle error with message object', () => {
    const exception = {
      message: 'Test error message',
    };
    const mockJson = jest.fn();
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: mockJson,
        }),
        getRequest: () => ({
          url: '/test',
        }),
      }),
    } as ArgumentsHost;

    filter.catch(exception, host);

    expect(logger.error).toHaveBeenCalled();
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test',
      error: 'Test error message',
    });
  });
});
