import { ApiProperty } from '@nestjs/swagger';
import { REMOVE_PRODUCT_FAVORITE_SUCCESSFULLY } from '../constants/http-response-description';

export class MessageResponseDto {
  @ApiProperty({ example: REMOVE_PRODUCT_FAVORITE_SUCCESSFULLY, description: 'Response message' })
  message: string;
}