import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { FavoritesResponseDto } from '../../../../favorites/dtos/favorites-response.dto';
import { TTL_REDIS } from '../../../constants/env';
import { REDIS_CLIENT } from './redis.module';
import { IFavoritesCacheRepository } from '../interfaces/cache/favorites-cache.interface';

@Injectable()
export class FavoritesRedisRepository implements IFavoritesCacheRepository {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  private getFavoritesKey(userId: number): string {
    return `favorites:${userId}`;
  }

  async cacheFavorites(userId: number, favorites: FavoritesResponseDto[]): Promise<FavoritesResponseDto[]> {
    const key = this.getFavoritesKey(userId);
    await this.redisClient.set(key, JSON.stringify(favorites), 'EX', TTL_REDIS); 
    return favorites;
  }

  async listFavorites(userId: number): Promise<FavoritesResponseDto[]> {
    const key = this.getFavoritesKey(userId);
    const favorites = await this.redisClient.get(key);

    if (!favorites) {
      return [];
    }

    return JSON.parse(favorites) as FavoritesResponseDto[];
  }

  async clearFavoritesCache(userId: number): Promise<void> {
    const key = this.getFavoritesKey(userId);
    await this.redisClient.del(key);
  }
}