import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, AlertsModule, CommonModule],
})
export class AppModule {}
