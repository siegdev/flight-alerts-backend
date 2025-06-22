import { Test } from '@nestjs/testing';
import { UserModule } from './user.module';
import { PrismaModule } from '../prisma/prisma.module';

describe('UserModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, UserModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
