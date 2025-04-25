export interface IUserRepository {
  create(email: string, name: string): Promise<{ email: string }>;
  findByEmail(email: string): Promise<any>;
  findAll(): Promise<any[]>;
  update(email: string, data: { name: string }): Promise<void>;
  delete(email: string): Promise<void>;
}
export const IUserRepositoryToken = Symbol('IUserRepositoryToken');
