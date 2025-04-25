import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductResponseDto } from '../../favorites/dtos/product-response.dto';

@Injectable()
export class ProductsService {
  private readonly products: ProductResponseDto[] = [
    {
      id: 1,
      title: 'Smartphone XYZ',
      price: 999.99,
      image: 'https://example.com/images/smartphone.jpg',
      brand: 'Brand A',
      reviewScore: 4.5,
    },
    {
      id: 2,
      title: 'Laptop ABC',
      price: 1999.99,
      image: 'https://example.com/images/laptop.jpg',
      brand: 'Brand B',
      reviewScore: 4.7,
    },
    {
      id: 3,
      title: 'Headphones DEF',
      price: 199.99,
      image: 'https://example.com/images/headphones.jpg',
      brand: 'Brand C',
      reviewScore: 4.3,
    },
    {
      id: 4,
      title: 'Smartwatch GHI',
      price: 299.99,
      image: 'https://example.com/images/smartwatch.jpg',
      brand: 'Brand D',
      reviewScore: 4.6,
    },
    {
      id: 5,
      title: 'Camera JKL',
      price: 499.99,
      image: 'https://example.com/images/camera.jpg',
      brand: 'Brand E',
      reviewScore: 4.8,
    },
  ];

  getMockedProducts() {
    return this.products;
  }

  getProductById(id: number): ProductResponseDto {
    const product = this.products.find((product) => product.id === Number(id));
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product as ProductResponseDto;
  }
}