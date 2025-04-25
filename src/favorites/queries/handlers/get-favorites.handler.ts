import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFavoritesQuery } from '../get-favorites.query';
import { GetFavoritesService } from '../../services/get-favorites.service';
import { EnricherFavoriteService } from '../../services/enricher-favorite.service';

@QueryHandler(GetFavoritesQuery)
export class GetFavoritesHandler implements IQueryHandler<GetFavoritesQuery> {
  constructor(
    private readonly getFavoritesService: GetFavoritesService,
    private readonly enricherFavoriteService: EnricherFavoriteService,
  ) {}

  async execute(query: GetFavoritesQuery): Promise<any> {
    const { userId } = query;
    const favorites = await this.getFavoritesService.getFavorites(userId);
    return this.enricherFavoriteService.enrichFavorites(favorites);
  }
}