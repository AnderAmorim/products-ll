import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFavoritesQuery } from '../get-favorites.query';
import { GetFavoritesService } from '../../services/get-favorites.service';
import { EnricherFavoriteService } from '../../services/enricher-favorite.service';
import { ProductResponseDto } from '../../dtos/product-response.dto';

@QueryHandler(GetFavoritesQuery)
export class GetFavoritesHandler implements IQueryHandler<GetFavoritesQuery> {
  constructor(
    private readonly getFavoritesService: GetFavoritesService,
    private readonly enricherFavoriteService: EnricherFavoriteService,
  ) {}

  async execute(query: GetFavoritesQuery): Promise<ProductResponseDto[]> {
    const { user_id } = query;
    const favorites = await this.getFavoritesService.getFavorites(user_id);
    if (!favorites) {
      return [];
    }
    return this.enricherFavoriteService.enrichFavorites(favorites);
  }
}