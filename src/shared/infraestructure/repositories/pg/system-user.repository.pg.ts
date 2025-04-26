import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { ISystemUserRepository } from '../interfaces/relational/system-user.repository';
import { PG_POOL } from './pg.module';

@Injectable()
export class SystemUserRepositoryPostgres implements ISystemUserRepository {
  constructor(
    @Inject(PG_POOL)
    private readonly pool: Pool,
  ) {}

  async findByEmail(email: string): Promise<any | null> {
    const query = `
      SELECT id, email, password
      FROM system_users
      WHERE LOWER(email) = LOWER($1)
    `;
    const result = await this.pool.query(query, [email.trim()]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}