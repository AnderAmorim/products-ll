import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../products/services/products.service';
import { ProductResponseDto } from '../dtos/product-response.dto';

@Injectable()
export class EnricherFavoriteService {
  constructor(private readonly productsService: ProductsService) {}

  async enrichFavorites(favorites: any[]): Promise<ProductResponseDto[]> {
    return Promise.all(
      favorites.map(async (favorite) => {
        const product = this.productsService.getProductById(favorite.product_id);
        return {
          ...product,
        };
      }),
    );
  }
}