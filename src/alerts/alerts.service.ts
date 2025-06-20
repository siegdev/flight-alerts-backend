import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, dto: CreateAlertDto) {
    try {
      return await this.prisma.flightAlert.create({
        data: {
          email,
          origin: dto.origin,
          destination: dto.destination,
          maxPrice: dto.maxPrice,
          departureDate: new Date(dto.departureDate),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('This alert already exists');
      }
      throw error;
    }
  }

  findAllByEmail(email: string) {
    return this.prisma.flightAlert.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string, email: string): Promise<void> {
    const alert = await this.prisma.flightAlert.findFirst({
      where: {
        id,
        email,
      },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    await this.prisma.flightAlert.delete({
      where: {
        id,
      },
    });
  }
}
