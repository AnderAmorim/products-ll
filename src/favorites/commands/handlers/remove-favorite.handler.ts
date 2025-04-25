import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveFavoriteCommand } from '../remove-favorite.command';
import { RemoveFavoriteService } from '../../services/remove-favorite.service';
import { GetFavoriteByUserService } from '../..//services/get-favorite-by-user.service';

@CommandHandler(RemoveFavoriteCommand)
export class RemoveFavoriteHandler implements ICommandHandler<RemoveFavoriteCommand> {
  constructor(
    private readonly removeFavoriteService: RemoveFavoriteService,
    private readonly getFavoriteByUserService: GetFavoriteByUserService, // Serviço para verificar favoritos
  ) {}

  async execute(command: RemoveFavoriteCommand): Promise<any> {
    const { userId, productId } = command;

    const favorite = await this.getFavoriteByUserService.execute(userId, productId);
    if (!favorite) {
      return { message: `Product ${productId} not exists in favorites of user ${userId}` };
    }

    await this.removeFavoriteService.execute(userId, productId);

    return { message: `Favorite with product_id ${productId} removed successfully` };
  }
}