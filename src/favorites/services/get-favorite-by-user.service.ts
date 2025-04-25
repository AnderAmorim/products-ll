import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/favorites.repository';

@Injectable()
export class GetFavoriteByUserService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  async execute(userId: number, product_id: number): Promise<any | null> {
    return this.favoritesRepository.findFavorite(userId, product_id);
  }
}