import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/favorites.repository';

@Injectable()
export class GetFavoritesService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository
  ) {}

  async getFavorites(userId: number): Promise<any[]> {
    return this.favoritesRepository.list(userId); 
  }
}