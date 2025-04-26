import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, IUserRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/relational/user.repository';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponseDto | false> {
    const user = await this.userRepository.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return false;
  }

  async login(user: UserResponseDto): Promise<LoginResponseDto> {
    const payload = { id: user.id, email: user.email, name: user.name, scope: user.scope };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}