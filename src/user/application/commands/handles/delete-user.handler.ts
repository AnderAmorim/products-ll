import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../delete-user.command';
import { DeleteUserService } from '../../services/delete-user.service';
import { GetUserByEmailService } from '../../services/get-user-by-email.service';
import { BadRequestException } from '@nestjs/common';
import { USER_NOT_FOUND } from '../../../../shared/constants/http-response-description';
import { DeleteUserResponseDto } from '../../../dto/delete-user-response.dto';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly deleteUserService: DeleteUserService,
    private readonly getUserByEmailService: GetUserByEmailService,
  ) {}

  async execute(command: DeleteUserCommand): Promise<DeleteUserResponseDto> {
    const { email } = command;
    const user = await this.getUserByEmailService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }
    return await this.deleteUserService.deleteUser(email);
  }
}