import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class EnricherFavoriteService {
  constructor(private readonly productsService: ProductsService) {}

  async enrichFavorites(favorites: any[]): Promise<any[]> {
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