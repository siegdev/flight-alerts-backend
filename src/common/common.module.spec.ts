import { Test } from '@nestjs/testing';
import { CommonModule } from './common.module';
import { AppLogger } from './logger/logger.service';

describe('CommonModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [CommonModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should export AppLogger', async () => {
    const module = await Test.createTestingModule({
      imports: [CommonModule],
    }).compile();

    const logger = module.get(AppLogger);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(AppLogger);
  });
});
