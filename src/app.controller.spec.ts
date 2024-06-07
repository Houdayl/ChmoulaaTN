import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let jwtService: JwtService;
  let mockUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    jwtService = module.get<JwtService>(JwtService);

    // Define the mockUser object
    const hashedPassword = await bcrypt.hash('password', 12);
    mockUser = { id: 1, email: 'john.doe@example.com', password: hashedPassword };
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const hashedPassword = await bcrypt.hash('password', 12);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      jest.spyOn(appService, 'create').mockResolvedValue(mockUser);

      const result = await appController.register(
        'John Doe',
        'john.doe@example.com',
        'password',
      );

      const { password, ...expectedResult } = mockUser;

      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      jest.spyOn(appService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const response = { cookie: jest.fn() } as any;
      const result = await appController.login(
        'john.doe@example.com',
        'password',
        response,
      );

      expect(result).toEqual({ message: 'success' });
      expect(response.cookie).toHaveBeenCalledWith('jwt', 'token', { httpOnly: true });
    });

    it('should throw an error if credentials are invalid', async () => {
      jest.spyOn(appService, 'findOne').mockResolvedValue(null);

      await expect(
        appController.login('john.doe@example.com', 'password', {} as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
