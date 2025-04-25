import { FavoritesResponseDto } from "../../../../favorites/dtos/favorites-response.dto";

export interface IFavoritesRepository {
  list(user_id: number): Promise<FavoritesResponseDto[] | null>;
  addFavorite(user_id: number, product_id: number): Promise<FavoritesResponseDto | null>;
  findFavorite(user_id: number, product_id: number): Promise<FavoritesResponseDto | null>;
  removeFavorite(user_id: number, product_id: number): Promise<void>;
}
export const IFavoritesRepositoryToken = Symbol('IFavoritesRepository');