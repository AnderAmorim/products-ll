import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { CreateUseService } from '../../services/create-user.service';
import { UserResponseDto } from '../../../dto/user-response.dto';
import { BadRequestException } from '@nestjs/common';
import { EMAIL_ALREADY_REGISTERED_ERROR } from '../../../../shared/constants/http-response-description';
import { GetUserByEmailService } from '../../services/get-user-by-email.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly createUserService: CreateUseService,
    private readonly getUserByEmailService: GetUserByEmailService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { email, name, password } = command;
    const userExists = await this.getUserByEmailService.getUserByEmail(email);

    if (userExists) {
      throw new BadRequestException(EMAIL_ALREADY_REGISTERED_ERROR);
    }
    return this.createUserService.createUser(email, name, password);
  }
}