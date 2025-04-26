import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/relational/favorites.repository';
import { FavoritesResponseDto } from '../dtos/favorites-response.dto';

@Injectable()
export class GetFavoriteByUserService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  async execute(user_id: number, product_id: number): Promise<FavoritesResponseDto | null> {
    return this.favoritesRepository.findFavorite(user_id, product_id);
  }
}