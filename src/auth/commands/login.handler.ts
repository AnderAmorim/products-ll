import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../services/login.service';
import { INVALID_CREDENTIALS_ERROR } from '../../shared/constants/http-response-description';
import { LoginResponseDto } from '../dto/login-response.dto';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly loginService: LoginService) {}

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const { email, password } = command;

    const user = await this.loginService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_ERROR);
    }

    return this.loginService.login(user);
  }
}