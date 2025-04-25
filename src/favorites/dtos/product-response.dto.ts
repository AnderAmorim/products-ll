import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the product' })
  id: number;

  @ApiProperty({ example: 'Smartphone XYZ', description: 'Title of the product' })
  title: string;

  @ApiProperty({ example: 999.99, description: 'Price of the product' })
  price: number;

  @ApiProperty({
    example: 'https://example.com/images/smartphone.jpg',
    description: 'URL of the product image',
  })
  image: string;

  @ApiProperty({ example: 'Brand A', description: 'Brand of the product' })
  brand: string;

  @ApiProperty({ example: 4.5, description: 'Review score of the product' })
  reviewScore: number;
}