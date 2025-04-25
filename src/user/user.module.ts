import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controller/user.controller';
import { CreateUseService } from './application/services/create-user.service';
import { UpdateUserHandler } from './application/commands/handles/update-user.handler';
import { DeleteUserHandler } from './application/commands/handles/delete-user.handler';
import { GetUserByEmailHandler } from './application/queries/handlers/get-user-by-email.handler';
import { ListUsersHandler } from './application/queries/handlers/list-users.handler';
import { FindAllUsersService } from './application/services/find-all-users.service';
import { DeleteUserService } from './application/services/delete-user.service';
import { UpdateUserService } from './application/services/update-user.service';
import { GetUserByEmailService } from './application/services/get-user-by-email.service';
import { CreateUserHandler } from './application/commands/handles/create-user.handler';
import { JWT_EXPIRATION_TIME } from '../shared/constants/env';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    CreateUseService,

    ListUsersHandler,
    FindAllUsersService,

    UpdateUserHandler,
    UpdateUserService,

    DeleteUserHandler,
    DeleteUserService,

    GetUserByEmailHandler,
    GetUserByEmailService,
  ],
})
export class UserModule {}
