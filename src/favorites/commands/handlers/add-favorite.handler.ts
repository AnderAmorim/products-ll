import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddFavoriteCommand } from '../add-favorite.command';
import { AddFavoritesService } from '../../services/add-favorite.service';
import { ProductsService } from '../../../products/services/products.service';
import { NotFoundException } from '@nestjs/common';
import { GetFavoriteByUserService } from '../../services/get-favorite-by-user.service';
import { FavoritesResponseDto } from '../../dtos/favorites-response.dto';

@CommandHandler(AddFavoriteCommand)
export class AddFavoriteHandler implements ICommandHandler<AddFavoriteCommand> {
  constructor(
    private readonly addFavoritesService: AddFavoritesService,
    private readonly productsService: ProductsService,
    private readonly getFavoriteByUserService: GetFavoriteByUserService,
  ) {}

  async execute(command: AddFavoriteCommand): Promise<FavoritesResponseDto | true> {
    const { user_id, product_id } = command;

    const product = this.productsService.getProductById(product_id);
    if (!product) {
      throw new NotFoundException(`Product with id ${product_id} not found`);
    }

    const isAlreadyFavorite = await this.getFavoriteByUserService.execute(user_id, product_id);
    if (isAlreadyFavorite) {
      return true; // retornar ok, produto já adicionado
    }

    return this.addFavoritesService.addFavorite(user_id, product_id);
  }
}