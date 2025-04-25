import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveFavoriteCommand } from '../remove-favorite.command';
import { RemoveFavoriteService } from '../../services/remove-favorite.service';
import { GetFavoriteByUserService } from '../..//services/get-favorite-by-user.service';
import { MessageResponseDto } from '../../../shared/dtos/message.dto';

@CommandHandler(RemoveFavoriteCommand)
export class RemoveFavoriteHandler implements ICommandHandler<RemoveFavoriteCommand> {
  constructor(
    private readonly removeFavoriteService: RemoveFavoriteService,
    private readonly getFavoriteByUserService: GetFavoriteByUserService,
  ) {}

  async execute(command: RemoveFavoriteCommand): Promise<MessageResponseDto> {
    const { user_id, productId } = command;

    const favorite = await this.getFavoriteByUserService.execute(user_id, productId);
    if (!favorite) {
      return { message: `Product ${productId} not exists in favorites of user ${user_id}` };
    }

    await this.removeFavoriteService.execute(user_id, productId);

    return { message: `Favorite with product_id ${productId} removed successfully` };
  }
}