import { AppLogger } from './logger.service';

describe('AppLogger', () => {
  it('should log without throwing', () => {
    const logger = new AppLogger();
    expect(() => logger.log('test')).not.toThrow();
    expect(() => logger.error('test')).not.toThrow();
    expect(() => logger.warn('test')).not.toThrow();
    expect(() => logger.debug('test')).not.toThrow();
    expect(() => logger.verbose('test')).not.toThrow();
  });
});
