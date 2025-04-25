import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id?: number;

  @ApiProperty({ example: 'Anderson Amorim' })
  name: string;

  @ApiProperty({ example: 'anderson.amorim@example.com' })
  email: string;
}
