export interface IFavoritesRepository {
  list(userId: number): Promise<any | null>;
  addFavorite(userId: number, product_id: number): Promise<any | null>;
  findFavorite(userId: number, product_id: number): Promise<any | null>;
  removeFavorite(userId: number, product_id: number): Promise<any | null>;
}
export const IFavoritesRepositoryToken = Symbol('IFavoritesRepository');