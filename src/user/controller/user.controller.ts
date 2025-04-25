import { Controller, Post, Body, Get, HttpStatus, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/creater-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { ListUsersQuery } from '../application/queries/list-users.query';
import { UpdateUserCommand } from '../application/commands/update-user.command';
import { DeleteUserCommand } from '../application/commands/delete-user.command';
import { GetUserByEmailQuery } from '../application/queries/get-user-by-email.query';
import { EMAIL_ALREADY_REGISTERED_ERROR, GET_USER_SUCCESSFULLY, LIST_USERS_ERROR, LIST_USERS_SUCCESSFULLY, USER_CREATED_SUCCESSFULLY, USER_DELETED_SUCCESSFULLY, USER_NOT_FOUND, USER_UPDATED_SUCCESSFULLY } from '../../shared/constants/http-response-description';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DecodeUriPipe } from '../../shared/pipes/decode-uri.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('')
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({
    description: USER_CREATED_SUCCESSFULLY,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: EMAIL_ALREADY_REGISTERED_ERROR,
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, name } = createUserDto;
    return this.commandBus.execute(new CreateUserCommand(email, name));
  }

  @Get('')
  @ApiOkResponse({ type: UserResponseDto, isArray: true, description: LIST_USERS_SUCCESSFULLY })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: LIST_USERS_ERROR,
  })
  async list(): Promise<UserResponseDto[]> {
    return this.queryBus.execute(new ListUsersQuery());
  }

  @Get(':email')
  @ApiOkResponse({ type: UserResponseDto, description: GET_USER_SUCCESSFULLY })
  async getByEmail(@Param('email', DecodeUriPipe) email: string): Promise<UserResponseDto> {
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  @Put(':email')
  @ApiOkResponse({ description: USER_UPDATED_SUCCESSFULLY })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: USER_NOT_FOUND,
  })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('email', DecodeUriPipe) email: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { name } = body;
    return this.commandBus.execute(new UpdateUserCommand(email, name));
  }

  @Delete(':email')
  @ApiOkResponse({ description: USER_DELETED_SUCCESSFULLY })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: USER_NOT_FOUND,
  })
  async delete(@Param('email', DecodeUriPipe) email: string): Promise<UserResponseDto> {
    return this.commandBus.execute(new DeleteUserCommand(email));
  }
}
