import * as Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', example: 'Anderson Amorim' })
  name: string;

  static validationSchema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'The "name" is required.',
      'any.required': 'The "name" is required.',
    }),
  });
}