import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { IUserRepository } from '../interfaces/user.repository';
import { USER_NOT_FOUND } from '../../../constants/http-response-description';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../../../../user/dto/user-response.dto';

@Injectable()
export class UserRepositoryPostgres implements IUserRepository {
  constructor(
    @Inject('PG_POOL')
    private readonly pool: Pool,
  ) {}

  async create(email: string, name: string, password: string): Promise<UserResponseDto> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const hashedPassword = await bcrypt.hash(password, 10);

      const userResult = await client.query(
        'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id',
        [email, name, hashedPassword],
      );
      const user_id = userResult.rows[0].id;

      await client.query(
        'INSERT INTO user_access_levels (user_id, scope) VALUES ($1, $2)',
        [user_id, 'client'],
      );

      await client.query('COMMIT');
      return { email, name, id: user_id, scope: userResult.rows[0].scope };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const query = `
      SELECT u.id, u.email, u.name, u.password, ua.scope
      FROM users u
      LEFT JOIN user_access_levels ua ON u.id = ua.user_id
      WHERE LOWER(u.email) = LOWER($1)
    `;
    const result = await this.pool.query(query, [email.trim()]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const query = `
      SELECT u.id, u.email, u.name, ua.scope
      FROM users u
      LEFT JOIN user_access_levels ua ON u.id = ua.user_id
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async update(email: string, data: { name: string }): Promise<void> {
    const query = 'UPDATE users SET name = $1 WHERE LOWER(email) = LOWER($2)';
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
