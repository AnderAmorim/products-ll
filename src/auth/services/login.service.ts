import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, IUserRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/user.repository';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return true;
    }
    return false;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}