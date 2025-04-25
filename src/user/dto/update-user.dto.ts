import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', example: 'Anderson Amorim' })
  name: string;

  @ApiProperty({
    description: 'User E-mail',
    example: 'anderson@example.com',
  })
  email: string;
}