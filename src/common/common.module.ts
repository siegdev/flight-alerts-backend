import { Module } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
  providers: [AppLogger, AllExceptionsFilter],
  exports: [AppLogger],
})
export class CommonModule {}
