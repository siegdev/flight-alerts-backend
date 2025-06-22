/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create new user when user does not exist', async () => {
      const dto = { email: 'test@example.com' };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      const mockUser = { id: '1', email: dto.email, createdAt: new Date() };
      jest.spyOn(service, 'createUser').mockResolvedValue(mockUser);

      const result = await controller.createUser(dto);

      expect(service.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(service.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });

    it('should return existing user when user exists', async () => {
      const dto = { email: 'test@example.com' };
      const existingUser = { id: '1', email: dto.email, createdAt: new Date() };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(existingUser);

      const result = await controller.createUser(dto);

      expect(service.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(service.createUser).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });
  });
});
