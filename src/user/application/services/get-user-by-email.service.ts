import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, IUserRepositoryToken } from '../../../shared/infraestructure/repositories/interfaces/user.repository';
import { UserResponseDto } from '../../dto/user-response.dto';

@Injectable()
export class GetUserByEmailService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}