import { UserResponseDto } from "../../../../../user/dto/user-response.dto";

export interface IUserRepository {
  create(email: string, name: string, password: string): Promise<UserResponseDto>;
  findByEmail(email: string): Promise<UserResponseDto | null>;
  findAll(): Promise<UserResponseDto[]>;
  update(email: string, data: { name: string }): Promise<void>;
  delete(email: string): Promise<void>;
}
export const IUserRepositoryToken = Symbol('IUserRepositoryToken');
