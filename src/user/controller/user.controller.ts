import { Controller, Post, Body, Get, HttpStatus, Param, Put, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { JoiValidationPipe } from '../../shared/pipes/joi-validation.pipe';
import { CreateUserSchema } from '../schemas/create-user.schema';
import { UpdateUserSchema } from '../schemas/update-user.schema';
import { SetScope } from '../../shared/decorators/set-scope';
import { ScopesEnum } from '../../shared/enums/scopes.enum';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { DeleteUserSchema } from '../schemas/delete-user.schema';

@ApiTags('users')
@ApiBearerAuth()
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
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, name, password } = createUserDto;
    return this.commandBus.execute(new CreateUserCommand(email, name, password));
  }

  @Get('')
  @SetScope(ScopesEnum.admin)
  @ApiOkResponse({ type: UserResponseDto, isArray: true, description: LIST_USERS_SUCCESSFULLY })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: LIST_USERS_ERROR,
  })
  async list(): Promise<UserResponseDto[]> {
    return this.queryBus.execute(new ListUsersQuery());
  }

  @Get(':email')
  @SetScope(ScopesEnum.admin)
  @ApiOkResponse({ type: UserResponseDto, description: GET_USER_SUCCESSFULLY })
  async getByEmail(@Param('email', DecodeUriPipe) email: string): Promise<UserResponseDto> {
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  @Put('')
  @SetScope(ScopesEnum.admin)
  @ApiOkResponse({ description: USER_UPDATED_SUCCESSFULLY })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: USER_NOT_FOUND,
  })
  @ApiBody({ type: UpdateUserDto })
  @UsePipes(new JoiValidationPipe(UpdateUserSchema))
  async update(
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { name, email } = body;
    return this.commandBus.execute(new UpdateUserCommand(email, name));
  }

  @Delete('')
  @SetScope(ScopesEnum.admin)
  @ApiOkResponse({ description: USER_DELETED_SUCCESSFULLY })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: USER_NOT_FOUND,
  })
  @ApiBody({ type: DeleteUserDto })
  @UsePipes(new JoiValidationPipe(DeleteUserSchema))
  async delete(
    @Body() body: DeleteUserDto
  ): Promise<UserResponseDto> {
    const { email } = body;
    return this.commandBus.execute(new DeleteUserCommand(email));
  }
}
