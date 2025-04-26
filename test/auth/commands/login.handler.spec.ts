import { Test, TestingModule } from '@nestjs/testing';
import { LoginHandler } from '../../../src/auth/commands/login.handler';
import { LoginService } from '../../../src/auth/services/login.service';
import { LoginCommand } from '../../../src/auth/commands/login.command';
import { UnauthorizedException } from '@nestjs/common';
import { INVALID_CREDENTIALS_ERROR } from '../../../src/shared/constants/http-response-description';
import { LoginResponseDto } from '../../../src/auth/dto/login-response.dto';
import { UserResponseDto } from '../../../src/user/dto/user-response.dto';

const mockLoginService = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

const mockUser: UserResponseDto = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashedPassword',
  scope: 'user',
};

const mockLoginResponse: LoginResponseDto = {
  access_token: 'mockAccessToken',
};

describe('LoginHandler', () => {
  let loginHandler: LoginHandler;
  let loginService: jest.Mocked<LoginService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    }).compile();

    loginHandler = module.get<LoginHandler>(LoginHandler);
    loginService = module.get<LoginService>(LoginService) as jest.Mocked<LoginService>;
  });

  it('should return a login response if credentials are valid', async () => {
    if(!mockUser.password) {
      throw new Error('Password is required');
    }
    loginService.validateUser.mockResolvedValue(mockUser);
    loginService.login.mockResolvedValue(mockLoginResponse);

    const command = new LoginCommand(mockUser.email, mockUser.password);
    const result = await loginHandler.execute(command);

    expect(result).toEqual(mockLoginResponse);
    expect(loginService.validateUser).toHaveBeenCalledWith(mockUser.email, mockUser.password);
    expect(loginService.login).toHaveBeenCalledWith(mockUser);
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    loginService.validateUser.mockResolvedValue(false);

    const command = new LoginCommand('invalid@example.com', 'wrongpassword');

    await expect(loginHandler.execute(command)).rejects.toThrow(
      new UnauthorizedException(INVALID_CREDENTIALS_ERROR),
    );
    expect(loginService.validateUser).toHaveBeenCalledWith('invalid@example.com', 'wrongpassword');
  });
});