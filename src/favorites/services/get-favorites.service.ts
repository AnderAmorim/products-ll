import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/relational/favorites.repository';
import { FavoritesResponseDto } from '../dtos/favorites-response.dto';
import { IFavoritesCacheRepository, IFavoritesCacheRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/cache/favorites-cache.interface';

@Injectable()
export class GetFavoritesService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository,

    @Inject(IFavoritesCacheRepositoryToken)
    private readonly favoritesCacheRepository: IFavoritesCacheRepository,
  ) {}

  async getFavorites(user_id: number): Promise<FavoritesResponseDto[]> {
    const cachedFavorites = await this.favoritesCacheRepository.listFavorites(user_id);

    if (cachedFavorites) {
      console.log('Cache hit: favorites found in cache');
      return cachedFavorites;
    }

    const favoritesFromDb = await this.favoritesRepository.list(user_id);

    if (!favoritesFromDb) {
      throw new Error('Error on list favorites');
    }

    await this.favoritesCacheRepository.cacheFavorites(user_id, favoritesFromDb);

    if (favoritesFromDb.length === 0) {
      console.log('No favorites found in database');
    }

    return favoritesFromDb;
  }
}