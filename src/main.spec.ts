/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import 'reflect-metadata';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('@nestjs/swagger', () => {
  const actualSwagger = jest.requireActual('@nestjs/swagger');
  return {
    ...actualSwagger,
    DocumentBuilder: jest.fn().mockReturnValue({
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setVersion: jest.fn().mockReturnThis(),
      addBearerAuth: jest.fn().mockReturnThis(),
      addTag: jest.fn().mockReturnThis(),
      setContact: jest.fn().mockReturnThis(),
      setLicense: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnThis(),
    }),
    SwaggerModule: {
      createDocument: jest.fn(),
      setup: jest.fn(),
    },
    ApiProperty: jest.fn().mockImplementation(() => {
      return (target: any, key: string) => {};
    }),
    ApiTags: jest.fn().mockImplementation(() => {
      return (target: any) => {};
    }),
    ApiBearerAuth: jest.fn().mockImplementation(() => {
      return (target: any) => {};
    }),
    ApiOperation: jest.fn().mockImplementation(() => {
      return (target: any, key: string, descriptor: PropertyDescriptor) => {};
    }),
    ApiResponse: jest.fn().mockImplementation(() => {
      return (target: any, key: string, descriptor: PropertyDescriptor) => {};
    }),
  };
});

describe('Main', () => {
  let app: any;
  const mockSwaggerDoc = {};

  beforeEach(() => {
    jest.clearAllMocks();

    app = {
      useGlobalPipes: jest.fn().mockReturnThis(),
      use: jest.fn().mockReturnThis(),
      useGlobalFilters: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnValue(new AllExceptionsFilter({} as any)),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(app);

    (SwaggerModule.createDocument as jest.Mock).mockReturnValue(mockSwaggerDoc);
  });

  afterEach(() => {
    delete process.env.PORT;
  });

  it('should bootstrap application with default port', async () => {
    const { bootstrap } = await import('./main');
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    expect(app.useGlobalFilters).toHaveBeenCalled();
    expect(app.listen).toHaveBeenCalledWith(3000);
  });

  it('should use custom port from environment', async () => {
    process.env.PORT = '4000';

    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(app.listen).toHaveBeenCalledWith('4000');
  });

  it('should setup Swagger documentation', async () => {
    const { bootstrap } = await import('./main');
    await bootstrap();

    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(
      app,
      expect.any(Object),
    );
    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'docs',
      app,
      mockSwaggerDoc,
    );
  });
});

describe('Bootstrap', () => {
  let app: any;
  const mockSwaggerDoc = {};

  beforeEach(() => {
    jest.clearAllMocks();

    app = {
      useGlobalPipes: jest.fn().mockReturnThis(),
      use: jest.fn().mockReturnThis(),
      useGlobalFilters: jest.fn().mockReturnThis(),
      get: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(app);
    (SwaggerModule.createDocument as jest.Mock).mockReturnValue(mockSwaggerDoc);
  });

  afterEach(() => {
    delete process.env.PORT;
  });

  it('should handle missing AllExceptionsFilter', async () => {
    app.get.mockImplementationOnce(() => {
      throw new Error('Filter not found');
    });

    const { bootstrap } = await import('./main');
    await bootstrap();

    expect(app.useGlobalPipes).toHaveBeenCalled();
    expect(app.useGlobalFilters).not.toHaveBeenCalled();
    expect(app.listen).toHaveBeenCalledWith(3000);
  });
});
