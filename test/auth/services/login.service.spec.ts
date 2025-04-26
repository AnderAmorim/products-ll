import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '../../../src/auth/services/login.service';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, IUserRepositoryToken } from '../../../src/shared/infraestructure/repositories/interfaces/relational/user.repository';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../../../src/user/dto/user-response.dto';
import { LoginResponseDto } from '../../../src/auth/dto/login-response.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockUser: UserResponseDto = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashedPassword',
  scope: 'user',
}

describe('LoginService', () => {
  let loginService: LoginService;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: IUserRepositoryToken,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    userRepository = module.get(IUserRepositoryToken);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return the user if email and password are valid', async () => {
      if(!mockUser.password) {
        throw new Error('Password is required');
      }
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      const result = await loginService.validateUser(mockUser.email, mockUser.password);
      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    });

    it('should return false if email or password are invalid', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await loginService.validateUser('invalid@example.com', 'password');
      expect(result).toBe(false);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('invalid@example.com');
    });
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {

      const mockToken = 'mockAccessToken';
      jwtService.sign.mockReturnValue(mockToken);

      const result: LoginResponseDto = await loginService.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        scope: mockUser.scope,
      });
    });
  });
});