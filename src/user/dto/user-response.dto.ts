import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ScopesEnum } from '../../shared/enums/scopes.enum';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'Anderson Amorim' })
  name: string;

  @ApiProperty({ example: 'anderson.amorim@example.com' })
  email: string;

  @ApiProperty({ example: ScopesEnum.client })
  scope: string;

  @ApiHideProperty()
  password?: string;
}
