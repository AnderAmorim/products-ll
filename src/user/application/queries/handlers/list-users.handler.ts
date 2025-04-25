import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from '../list-users.query';
import { FindAllUsersService } from '../../services/find-all-users.service';
import { UserResponseDto } from '../../../dto/user-response.dto';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(private readonly listAllUsers: FindAllUsersService) {}

  async execute(_: ListUsersQuery): Promise<UserResponseDto[]> {
    const users = await this.listAllUsers.findAll();
    return users;
  }
}