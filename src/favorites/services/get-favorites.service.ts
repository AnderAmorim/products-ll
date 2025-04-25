import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesRepository, IFavoritesRepositoryToken } from '../../shared/infraestructure/repositories/interfaces/favorites.repository';
import { FavoritesResponseDto } from '../dtos/favorites-response.dto';

@Injectable()
export class GetFavoritesService {
  constructor(
    @Inject(IFavoritesRepositoryToken)
    private readonly favoritesRepository: IFavoritesRepository
  ) {}

  async getFavorites(user_id: number): Promise<FavoritesResponseDto[] | null> {
    return this.favoritesRepository.list(user_id); 
  }
}``