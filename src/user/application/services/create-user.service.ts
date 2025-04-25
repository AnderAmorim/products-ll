import {
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../shared/infraestructure/repositories/interfaces/user.repository';

@Injectable()
export class CreateUseService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async createUser(email: string, name: string): Promise<any> {
    const newUser = await this.userRepository.create(email, name);

    return { email: newUser.email };
  }
}
