import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { IFavoritesRepository } from '../interfaces/favorites.repository';

@Injectable()
export class FavoritesRepository implements IFavoritesRepository {
  constructor(
    @Inject('PG_POOL')
    private readonly pool: Pool,
  ) {}

  async list(userId:number): Promise<any> {
    const query = `
      SELECT *
      FROM favorites f
      WHERE f.user_id = $1
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async addFavorite(userId: number, product_id: number): Promise<any> {
    const query = `
      INSERT INTO favorites (user_id, product_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await this.pool.query(query, [userId, product_id]);
    return result.rows[0];
  }

  async findFavorite(userId: number, product_id: number): Promise<any | null> {
    const query = `
      SELECT * FROM favorites
      WHERE user_id = $1 AND product_id = $2
    `;
    const result = await this.pool.query(query, [userId, product_id]);
    return result.rows[0] || null;
  }

  async removeFavorite(userId: number, productId: number): Promise<void> {
    const query = `
      DELETE FROM favorites
      WHERE user_id = $1 AND product_id = $2
    `;
    await this.pool.query(query, [userId, productId]);
  }
}