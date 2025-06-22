import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { generateVerificationCode } from '../utils/generate-code';
import { addMinutes } from 'date-fns';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async requestCode(dto: RequestCodeDto): Promise<void> {
    try {
      const code: string = generateVerificationCode();

      const expiresAt: Date = addMinutes(new Date(), 10);

      await this.prisma.authCode.create({
        data: {
          email: dto.email,
          code,
          expiresAt,
        },
      });

      console.log(`[DEBUG] Verification code for ${dto.email}: ${code}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error generating code:', error.message);
        throw error;
      } else if (typeof error === 'string') {
        console.error('Unknown error:', error);
        throw new Error(error);
      } else {
        console.error('Unknown error:', JSON.stringify(error));
        throw new Error('Unknown error');
      }
    }
  }

  async verifyCode(dto: VerifyCodeDto): Promise<{ token: string }> {
    const record = await this.prisma.authCode.findFirst({
      where: {
        email: dto.email,
        code: dto.code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.prisma.authCode.delete({ where: { id: record.id } });

    const payload = { email: dto.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
