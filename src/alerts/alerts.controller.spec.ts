/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

describe('AlertsController', () => {
  let controller: AlertsController;
  let service: AlertsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        {
          provide: AlertsService,
          useValue: {
            create: jest.fn(),
            findAllByEmail: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AlertsController);
    service = module.get(AlertsService);
  });

  it('should call service.create', async () => {
    await controller.create({} as any, { email: 'test@example.com' });
    expect(service.create).toHaveBeenCalled();
  });

  it('should call service.findAllByEmail', async () => {
    await controller.findAll({ email: 'test@example.com' });
    expect(service.findAllByEmail).toHaveBeenCalled();
  });

  it('should call service.delete', async () => {
    await controller.remove('1', { email: 'test@example.com' });
    expect(service.delete).toHaveBeenCalled();
  });
});
