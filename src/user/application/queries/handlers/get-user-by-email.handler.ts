import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from '../get-user-by-email.query';
import { GetUserByEmailService } from '../../services/get-user-by-email.service';
import { UserResponseDto } from '../../../dto/user-response.dto';
import { USER_NOT_FOUND } from '../../../../shared/constants/http-response-description';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly getUserByEmailService: GetUserByEmailService) {}

  async execute(query: GetUserByEmailQuery): Promise<UserResponseDto> {
    const { email } = query;
    
    const user = await this.getUserByEmailService.getUserByEmail(email);
    if (user === null) {
      throw new Error(USER_NOT_FOUND);
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      scope: user.scope,
    };
  }
}