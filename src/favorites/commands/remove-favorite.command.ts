export class RemoveFavoriteCommand {
  constructor(public readonly userId: number, public readonly productId: number) {}
}