import {
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../shared/infraestructure/repositories/interfaces/relational/user.repository';
import { UserResponseDto } from '../../dto/user-response.dto';
import { INVALID_CREDENTIALS_ERROR } from '../../../shared/constants/http-response-description';

@Injectable()
export class CreateUseService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponseDto | UnauthorizedException> {

    const user = await this.userRepository.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    throw new UnauthorizedException(INVALID_CREDENTIALS_ERROR);
  }

  async createUser(email: string, name: string, password: string): Promise<any> {
    const newUser = await this.userRepository.create(email, name, password);
    return { email: newUser.email };
  }
}
