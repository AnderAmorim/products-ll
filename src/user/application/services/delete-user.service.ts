import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, IUserRepositoryToken } from '../../../shared/infraestructure/repositories/interfaces/user.repository';
import { USER_UPDATED_SUCCESSFULLY } from '../../../shared/constants/http-response-description';
import { DeleteUserResponseDto } from '../../dto/delete-user-response.dto';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async deleteUser(email: string): Promise<DeleteUserResponseDto> {
    await this.userRepository.delete(email);
    return { message: USER_UPDATED_SUCCESSFULLY };
  }
}