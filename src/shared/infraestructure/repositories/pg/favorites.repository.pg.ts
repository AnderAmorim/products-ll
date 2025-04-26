import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { IFavoritesRepository } from '../interfaces/relational/favorites.repository';
import { FavoritesResponseDto } from '../../../../favorites/dtos/favorites-response.dto';
import { PG_POOL } from './pg.module';

@Injectable()
export class FavoritesRepository implements IFavoritesRepository {
  constructor(
    @Inject(PG_POOL)
    private readonly pool: Pool,
  ) {}

  async list(user_id:number): Promise<FavoritesResponseDto[] | null> {
    const query = `
      SELECT *
      FROM favorites f
      WHERE f.user_id = $1
    `;
    const result = await this.pool.query(query, [user_id]);
    return result.rows;
  }

  async addFavorite(user_id: number, product_id: number): Promise<FavoritesResponseDto> {
    const query = `
      INSERT INTO favorites (user_id, product_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await this.pool.query(query, [user_id, product_id]);
    return result.rows[0];
  }

  async findFavorite(user_id: number, product_id: number): Promise<FavoritesResponseDto | null> {
    const query = `
      SELECT * FROM favorites
      WHERE user_id = $1 AND product_id = $2
    `;
    const result = await this.pool.query(query, [user_id, product_id]);
    return result.rows[0] || null;
  }

  async removeFavorite(user_id: number, productId: number): Promise<void> {
    const query = `
      DELETE FROM favorites
      WHERE user_id = $1 AND product_id = $2
    `;
    await this.pool.query(query, [user_id, productId]);
  }
}