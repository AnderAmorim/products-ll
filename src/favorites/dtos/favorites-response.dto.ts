import { ApiProperty } from '@nestjs/swagger';

export class FavoritesResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the favorite entry' })
  id: number;

  @ApiProperty({ example: 42, description: 'Unique identifier of the user who added the favorite' })
  user_id: number;

  @ApiProperty({ example: 101, description: 'Unique identifier of the product marked as favorite' })
  product_id: number;
}