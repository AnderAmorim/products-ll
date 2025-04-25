export class RemoveFavoriteCommand {
  constructor(public readonly user_id: number, public readonly productId: number) {}
}