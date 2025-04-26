import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/auth/controller/auth.controller';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../../../src/auth/commands/login.command';
import { LoginResponseDto } from '../../../src/auth/dto/login-response.dto';

const mockCommandBus = {
  execute: jest.fn(),
};

const mockLoginResponse: LoginResponseDto = {
  access_token: 'mockAccessToken',
};

describe('AuthController', () => {
  let authController: AuthController;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>;
  });

  it('should call CommandBus.execute with LoginCommand and return a LoginResponseDto', async () => {
    const email = 'john.doe@example.com';
    const password = 'password123';
    const body = { email, password };

    commandBus.execute.mockResolvedValue(mockLoginResponse);

    const result = await authController.login(body);

    expect(commandBus.execute).toHaveBeenCalledWith(new LoginCommand(email, password));
    expect(result).toEqual(mockLoginResponse);
  });
});