export class UpdateUserCommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {}
}