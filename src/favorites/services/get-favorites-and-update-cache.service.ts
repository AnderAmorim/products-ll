import { Injectable, Inject } from '@nestjs/common';
import { FavoritesResponseDto } from '../dtos/favorites-response.dto';
import { ERROR_ON_LIST_FAVORITE_PRODUCT } from '../../shared/constants/http-response-description';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/relational/favorites.repository';
import { IFavoritesCacheRepository, IFavoritesCacheRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/cache/favorites-cache.interface';
import { ILogging, ILoggingToken } from '../../shared/providers/logging';

@Injectable()
export class GetFavoritesAndUpdateCacheService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository,

    @Inject(IFavoritesCacheRepositoryToken)
    private readonly favoritesCacheRepository: IFavoritesCacheRepository,

    @Inject(ILoggingToken)
    private readonly logger: ILogging,
  ) {}

  async execute(user_id: number): Promise<FavoritesResponseDto[]> {
    const allFavorites = await this.favoritesRepository.list(user_id);

    if (!allFavorites || allFavorites.length === 0) {
      throw new Error(ERROR_ON_LIST_FAVORITE_PRODUCT);
    }

    await this.favoritesCacheRepository.cacheFavorites(user_id, allFavorites);
    this.logger.info('Cache updated!');

    return allFavorites;
  }
}