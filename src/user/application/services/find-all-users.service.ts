import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../shared/infraestructure/repositories/interfaces/user.repository';
import { UserResponseDto } from '../../dto/user-response.dto';

@Injectable()
export class FindAllUsersService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    if (!users || users.length === 0) {
      return [];
    }

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

  }
}
