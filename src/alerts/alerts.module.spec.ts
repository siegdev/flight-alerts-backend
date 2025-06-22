import { Test } from '@nestjs/testing';
import { AlertsModule } from './alerts.module';
import { PrismaModule } from '../prisma/prisma.module';

describe('AlertsModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, AlertsModule],
    }).compile();
    expect(module).toBeDefined();
  });
});
