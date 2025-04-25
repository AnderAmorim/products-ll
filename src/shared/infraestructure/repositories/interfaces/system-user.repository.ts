export interface ISystemUserRepository {
  findByEmail(email: string): Promise<any | null>;
}
export const ISystemUserRepositoryToken = Symbol('ISystemUserRepository');