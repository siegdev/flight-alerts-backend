/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Flight Alerts API')
    .setDescription('API for tracking flight deals')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('alerts', 'Flight alert operations')
    .addTag('auth', 'Authentication operations')
    .addTag('user', 'User operations')
    .setContact(
      'API Support',
      'https://github.com/siegdev',
      'julio.sieg@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const allExceptionsFilter = app.get(AllExceptionsFilter);
  app.useGlobalFilters(allExceptionsFilter);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
