import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddFavoriteCommand } from '../add-favorite.command';
import { AddFavoritesService } from '../../services/add-favorite.service';
import { ProductsService } from '../../../products/services/products.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { GetFavoriteByUserService } from '../../services/get-favorite-by-user.service';
import { EnricherFavoriteService } from '../../services/enricher-favorite.service';
import { ProductResponseDto } from '../../dtos/product-response.dto';
import { GetFavoritesAndUpdateCacheService } from '../../services/get-favorites-and-update-cache.service';
import { PRODUCT_ALREADY_REGISTERED_TO_FAVORITE } from '../../../shared/constants/http-response-description';

@CommandHandler(AddFavoriteCommand)
export class AddFavoriteHandler implements ICommandHandler<AddFavoriteCommand> {
  constructor(
    private readonly addFavoritesService: AddFavoritesService,
    private readonly productsService: ProductsService,
    private readonly getFavoriteByUserService: GetFavoriteByUserService,
    private readonly enricherFavoriteService: EnricherFavoriteService,
    private readonly getFavoritesAndUpdateCacheService: GetFavoritesAndUpdateCacheService,
  ) {}

  async execute(command: AddFavoriteCommand): Promise<ProductResponseDto[] | true> {
    const { user_id, product_id } = command;

    const product = this.productsService.getProductById(product_id);
    if (!product) {
      throw new NotFoundException(`Product with id ${product_id} not found`);
    }

    const isAlreadyFavorite = await this.getFavoriteByUserService.execute(user_id, product_id);
    if (isAlreadyFavorite) {
      
      throw new HttpException(
        { statusCode: HttpStatus.OK, message: PRODUCT_ALREADY_REGISTERED_TO_FAVORITE },
        HttpStatus.OK,
      );
    }
    
    await this.addFavoritesService.addFavorite(user_id, product_id);
    const updatedFavorites = await this.getFavoritesAndUpdateCacheService.execute(user_id);
    const favoritesUpdated = await this.enricherFavoriteService.enrichFavorites(updatedFavorites);
    return favoritesUpdated;
  }
}