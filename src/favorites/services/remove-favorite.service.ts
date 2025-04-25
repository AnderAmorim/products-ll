import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/favorites.repository';

@Injectable()
export class RemoveFavoriteService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  async execute(user_id: number, productId: number): Promise<void> {
    await this.favoritesRepository.removeFavorite(user_id, productId);
  }
}