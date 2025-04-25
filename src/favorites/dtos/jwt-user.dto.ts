export interface JwtUserDto {
  user: {
    id: number;
    email: string;
    name: string;
    scope: string;
  };
}