import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'Anderson Amorim' })
  name: string;

  @ApiProperty({
    description: 'User E-mail',
    example: 'anderson.amorim@exemple.com',
  })
  email: string;
}
