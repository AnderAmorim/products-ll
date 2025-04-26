import { Global, Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { FavoritesRedisRepository } from './redis/favorites.repository.redis';
import { IFavoritesCacheRepositoryToken } from './interfaces/cache/favorites-cache.interface';

@Global()
@Module({
  imports: [
    RedisModule,
  ],
  providers: [
    {
      provide: IFavoritesCacheRepositoryToken,
      useClass: FavoritesRedisRepository, 
    },
  ],
  exports: [IFavoritesCacheRepositoryToken],
})
export class RepositoriesCacheModule {}