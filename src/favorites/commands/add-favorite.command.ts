export class AddFavoriteCommand {
  constructor(public readonly userId: number, public readonly product_id: number) {}
}