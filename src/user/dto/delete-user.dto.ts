import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiProperty({
    description: 'User E-mail',
    example: 'anderson@example.com',
  })
  email: string;
}