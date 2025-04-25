import { Injectable } from '@nestjs/common';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/favorites.repository';
import { Inject } from '@nestjs/common';

@Injectable()
export class AddFavoritesService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  async addFavorite(userId: number, product_id: number): Promise<any> {
    return this.favoritesRepository.addFavorite(userId, product_id);
  }
}