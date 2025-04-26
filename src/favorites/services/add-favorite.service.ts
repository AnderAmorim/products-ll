import { Injectable, Inject } from '@nestjs/common';
import { FavoritesResponseDto } from '../dtos/favorites-response.dto';
import { ERROR_ON_ADD_FAVORITE_PRODUCT } from '../../shared/constants/http-response-description';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/relational/favorites.repository';

@Injectable()
export class AddFavoritesService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  async addFavorite(user_id: number, product_id: number): Promise<FavoritesResponseDto> {
    const favoriteAdded = await this.favoritesRepository.addFavorite(user_id, product_id);
    if (!favoriteAdded) {
      throw new Error(ERROR_ON_ADD_FAVORITE_PRODUCT);
    }
    return favoriteAdded;
  }
}