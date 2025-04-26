import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FavoritesController } from './controllers/favorites.controller';
import { GetFavoritesService } from './services/get-favorites.service';
import { GetFavoritesHandler } from './queries/handlers/get-favorites.handler';
import { AddFavoriteHandler } from './commands/handlers/add-favorite.handler';
import { AddFavoritesService } from './services/add-favorite.service';
import { ProductsService } from '../products/services/products.service';
import { GetFavoriteByUserService } from './services/get-favorite-by-user.service';
import { EnricherFavoriteService } from './services/enricher-favorite.service';
import { RemoveFavoriteHandler } from './commands/handlers/remove-favorite.handler';
import { RemoveFavoriteService } from './services/remove-favorite.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRATION_TIME } from '../shared/constants/env';
import { GetFavoritesAndUpdateCacheService } from './services/get-favorites-and-update-cache.service';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [FavoritesController],
  providers: [
    GetFavoritesService,
    GetFavoritesHandler,

    AddFavoriteHandler,
    AddFavoritesService,

    ProductsService,
    GetFavoriteByUserService,
    EnricherFavoriteService,

    RemoveFavoriteHandler,
    RemoveFavoriteService,

    GetFavoritesAndUpdateCacheService,
  ],
})
export class FavoritesModule {}