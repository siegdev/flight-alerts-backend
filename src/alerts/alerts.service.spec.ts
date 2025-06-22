/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('AlertsService', () => {
  let service: AlertsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: PrismaService,
          useValue: {
            flightAlert: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    const createDto = {
      origin: 'GRU',
      destination: 'JFK',
      maxPrice: 1000,
      departureDate: '2025-12-25',
    };

    it('should create alert', async () => {
      const mockAlert = {
        id: '1',
        email: 'test@example.com',
        origin: createDto.origin,
        destination: createDto.destination,
        maxPrice: createDto.maxPrice,
        departureDate: new Date(createDto.departureDate),
        createdAt: new Date(),
      };
      jest.spyOn(prisma.flightAlert, 'create').mockResolvedValueOnce(mockAlert);
      const result = await service.create('test@example.com', createDto);
      expect(result).toEqual(mockAlert);
    });

    it('should handle duplicate alerts', async () => {
      jest.spyOn(prisma.flightAlert, 'create').mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('Duplicate', {
          code: 'P2002',
          clientVersion: '1',
        }),
      );
      await expect(
        service.create('test@example.com', createDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw unknown error on create', async () => {
      const error = new Error('Unknown error');
      jest.spyOn(prisma.flightAlert, 'create').mockRejectedValueOnce(error);
      await expect(
        service.create('test@example.com', {
          origin: 'GRU',
          destination: 'JFK',
          maxPrice: 1000,
          departureDate: '2025-12-25',
        }),
      ).rejects.toThrow('Unknown error');
    });
  });

  describe('findAllByEmail', () => {
    it('should return alerts', async () => {
      const mockAlerts = [
        {
          id: '1',
          email: 'test@example.com',
          origin: 'GRU',
          destination: 'JFK',
          maxPrice: 1000,
          departureDate: new Date('2025-12-25'),
          createdAt: new Date(),
        },
        {
          id: '2',
          email: 'test2@example.com',
          origin: 'LAX',
          destination: 'ORD',
          maxPrice: 800,
          departureDate: new Date('2025-12-30'),
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(prisma.flightAlert, 'findMany')
        .mockResolvedValueOnce(mockAlerts);
      const result = await service.findAllByEmail('test@example.com');
      expect(result).toEqual(mockAlerts);
    });
  });

  describe('delete', () => {
    it('should delete existing alert', async () => {
      const mockAlert = {
        id: '1',
        email: 'test@example.com',
        origin: 'GRU',
        destination: 'JFK',
        maxPrice: 1000,
        departureDate: new Date('2025-12-25'),
        createdAt: new Date(),
      };
      jest
        .spyOn(prisma.flightAlert, 'findFirst')
        .mockResolvedValueOnce(mockAlert);
      await service.delete('1', 'test@example.com');
      expect(prisma.flightAlert.delete).toHaveBeenCalled();
    });

    it('should throw if alert not found', async () => {
      jest.spyOn(prisma.flightAlert, 'findFirst').mockResolvedValueOnce(null);
      await expect(service.delete('1', 'test@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
