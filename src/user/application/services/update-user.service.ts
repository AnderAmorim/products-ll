import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository, IUserRepositoryToken } from '../../../shared/infraestructure/repositories/interfaces/user.repository';
import { USER_NOT_FOUND, USER_UPDATED_SUCCESSFULLY } from '../../../shared/constants/http-response-description';

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async updateUser(email: string, name: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    await this.userRepository.update(email, { name });
    return { message: USER_UPDATED_SUCCESSFULLY };
  }
}