import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, IUserRepositoryToken } from '../../../shared/infraestructure/repositories/interfaces/relational/user.repository';
import { USER_DELETED_SUCCESSFULLY } from '../../../shared/constants/http-response-description';
import { DeleteUserResponseDto } from '../../dto/delete-user-response.dto';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async deleteUser(email: string): Promise<DeleteUserResponseDto> {
    await this.userRepository.delete(email);
    return { message: USER_DELETED_SUCCESSFULLY };
  }
}