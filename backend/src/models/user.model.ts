import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { User, UserRegistration } from '../types';

export class UserModel {
  static async create(userData: UserRegistration): Promise<User> {
    const { email, password, isAdmin = false } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, password, is_admin)
      VALUES ($1, $2, $3)
      RETURNING id, email, is_admin, created_at
    `;

    const result = await pool.query(query, [email, hashedPassword, isAdmin]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
