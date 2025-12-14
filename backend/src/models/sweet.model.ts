import pool from '../config/database';
import { Sweet, CreateSweet, UpdateSweet } from '../types';

export class SweetModel {
  static async create(sweetData: CreateSweet): Promise<Sweet> {
    const { name, category, price, quantity } = sweetData;

    const query = `
      INSERT INTO sweets (name, category, price, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [name, category, price, quantity]);
    return result.rows[0];
  }

  static async findAll(): Promise<Sweet[]> {
    const query = 'SELECT * FROM sweets ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number): Promise<Sweet | null> {
    const query = 'SELECT * FROM sweets WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, sweetData: UpdateSweet): Promise<Sweet | null> {
    const { name, category, price, quantity } = sweetData;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (quantity !== undefined) {
      updates.push(`quantity = $${paramIndex++}`);
      values.push(quantity);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE sweets
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM sweets WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async search(searchParams: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> {
    const { name, category, minPrice, maxPrice } = searchParams;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name) {
      conditions.push(`name ILIKE $${paramIndex++}`);
      values.push(`%${name}%`);
    }

    if (category) {
      conditions.push(`category ILIKE $${paramIndex++}`);
      values.push(`%${category}%`);
    }

    if (minPrice !== undefined) {
      conditions.push(`price >= $${paramIndex++}`);
      values.push(minPrice);
    }

    if (maxPrice !== undefined) {
      conditions.push(`price <= $${paramIndex++}`);
      values.push(maxPrice);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const query = `
      SELECT * FROM sweets
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updateQuantity(id: number, quantityChange: number): Promise<Sweet | null> {
    const query = `
      UPDATE sweets
      SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [quantityChange, id]);
    return result.rows[0] || null;
  }

  static async purchase(id: number, quantity: number): Promise<Sweet | null> {
    // Check if sufficient quantity available
    const sweet = await this.findById(id);
    if (!sweet || sweet.quantity < quantity) {
      return null;
    }

    return this.updateQuantity(id, -quantity);
  }

  static async restock(id: number, quantity: number): Promise<Sweet | null> {
    return this.updateQuantity(id, quantity);
  }
}
