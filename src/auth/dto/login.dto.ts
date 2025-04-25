import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Sample email of the user',
    example: 'admin',
  })
  email: string;

  @ApiProperty({ description: 'Sample password of the user', example: 'admin' })
  password: string;
}
