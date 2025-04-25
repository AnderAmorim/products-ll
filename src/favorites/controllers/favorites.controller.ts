import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFavoritesQuery } from '../queries/get-favorites.query';
import { AddFavoriteCommand } from '../commands/add-favorite.command';
import { RemoveFavoriteCommand } from '../commands/remove-favorite.command';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Get(':userId')
  async getFavorites(@Param('userId') userId: number) {
    return this.queryBus.execute(new GetFavoritesQuery(userId));
  }

  @Post(':userId/:product_id')
  async addFavorite(
    @Param('userId') userId: number,
    @Param('product_id') product_id: number,
  ) {
    return this.commandBus.execute(new AddFavoriteCommand(userId, product_id));
  }

  @Delete(':userId/:product_id')
  async removeFavorite(
    @Param('userId') userId: number,
    @Param('product_id') product_id: number,
  ) {
    return this.commandBus.execute(new RemoveFavoriteCommand(userId, product_id));
  }
}