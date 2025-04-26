import { FavoritesResponseDto } from "../../../../../favorites/dtos/favorites-response.dto";

export interface IFavoritesCacheRepository {
  cacheFavorites(userId: number, favorites: FavoritesResponseDto[]): Promise<FavoritesResponseDto[]>;
  listFavorites(userId: number): Promise<FavoritesResponseDto[]>;
  clearFavoritesCache(userId: number): Promise<void>;
}

export const IFavoritesCacheRepositoryToken = Symbol('IFavoritesCacheRepository');