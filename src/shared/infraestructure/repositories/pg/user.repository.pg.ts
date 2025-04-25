import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { IUserRepository } from '../interfaces/user.repository';
import { USER_NOT_FOUND } from '../../../constants/http-response-description';

@Injectable()
export class UserRepositoryPostgres implements IUserRepository {
  constructor(
    @Inject('PG_POOL')
    private readonly pool: Pool,
  ) {}

  async create(email: string, name: string): Promise<{ email: string }> {
    await this.pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2)',
      [email, name],
    );
    return { email };
  }

  async findByEmail(email: string): Promise<any | null> {
    const query = `
      SELECT id, email, name, password
      FROM users
      WHERE LOWER(email) = LOWER($1)
    `;
    const result = await this.pool.query(query, [email.trim()]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async findAll(): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT id, email FROM users',
    );
    return result.rows;
  }

  async update(email: string, data: { name: string }): Promise<void> {
    const query = 'UPDATE users SET name = $1 WHERE  LOWER(email) = LOWER($2)';
    const values = [data.name, email.trim()];
    const result = await this.pool.query(query, values);

    if (result.rowCount === 0) {
      throw new Error(USER_NOT_FOUND);
    }
  }

  async delete(email: string): Promise<void> {
    const query = 'DELETE FROM users WHERE LOWER(email) = LOWER($1)';
    const result = await this.pool.query(query, [email.trim()]);

    if (result.rowCount === 0) {
      throw new Error(USER_NOT_FOUND);
    }
  }
}
