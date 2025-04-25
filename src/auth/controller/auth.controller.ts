import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { INVALID_CREDENTIALS_ERROR, LOGIN_SUCCESSFULLY } from '../../shared/constants/http-response-description';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: LOGIN_SUCCESSFULLY,
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: INVALID_CREDENTIALS_ERROR,
  })
  async login(@Body() body: { email: string; password: string }): Promise<LoginResponseDto> {
    const { email, password } = body;
    return this.commandBus.execute(new LoginCommand(email, password));
  }
}