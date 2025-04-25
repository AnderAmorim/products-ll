import { ApiProperty } from '@nestjs/swagger';
import { USER_DELETED_SUCCESSFULLY } from '../../shared/constants/http-response-description';

export class DeleteUserResponseDto {
  @ApiProperty({ example: USER_DELETED_SUCCESSFULLY })
  message: string;
}
