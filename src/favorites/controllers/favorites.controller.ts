import { Controller, Delete, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFavoritesQuery } from '../queries/get-favorites.query';
import { AddFavoriteCommand } from '../commands/add-favorite.command';
import { RemoveFavoriteCommand } from '../commands/remove-favorite.command';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ADD_FAVORITE_PRODUCT_SUCCESSFULLY, LIST_PRODUCT_FAVORITES_SUCCESSFULLY } from '../../shared/constants/http-response-description';
import { JwtUserDto } from '../dtos/jwt-user.dto';
import { FavoritesResponseDto } from '../dtos/favorites-response.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOkResponse({
    description: LIST_PRODUCT_FAVORITES_SUCCESSFULLY,
    type: ProductResponseDto,
    isArray: true,
  })
  async getFavorites(@Req() req: JwtUserDto): Promise<ProductResponseDto[]>  {
    const user_id = req.user.id;
    return this.queryBus.execute(new GetFavoritesQuery(user_id));
  }

  @Post('')
  @ApiOkResponse({
    description: ADD_FAVORITE_PRODUCT_SUCCESSFULLY,
    type: ProductResponseDto,
    isArray: true,
  })
  async addFavorite(
    @Req() req: JwtUserDto,
    @Body() body: FavoritesResponseDto,
  ) : Promise<ProductResponseDto[] | true> {
    const user_id = req.user.id;
    const product_id = body.product_id;
    return this.commandBus.execute(new AddFavoriteCommand(user_id, product_id));
  }

  @Delete('')
  async removeFavorite(
    @Req() req: JwtUserDto,
    @Body() body: FavoritesResponseDto
  ) {
    const user_id = req.user.id;
    const product_id = body.product_id;
    return this.commandBus.execute(new RemoveFavoriteCommand(user_id, product_id));
  }
}