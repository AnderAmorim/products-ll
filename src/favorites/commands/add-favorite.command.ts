export class AddFavoriteCommand {
  constructor(public readonly user_id: number, public readonly product_id: number) {}
}