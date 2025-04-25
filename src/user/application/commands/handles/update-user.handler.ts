import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { UpdateUserService } from '../../services/update-user.service';
import { UserResponseDto } from '../../../dto/user-response.dto';
import { GetUserByEmailService } from '../../services/get-user-by-email.service';
import { USER_NOT_FOUND } from '../../../../shared/constants/http-response-description';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly updateUserService: UpdateUserService,
    private readonly getUserByEmailService: GetUserByEmailService,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserResponseDto> {
    const { email, name } = command;
    await this.updateUserService.updateUser(email, name);
    const updatedUser = await this.getUserByEmailService.getUserByEmail(email);
    if (!updatedUser) {
      throw new Error(USER_NOT_FOUND);
    }
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    }
  }
}