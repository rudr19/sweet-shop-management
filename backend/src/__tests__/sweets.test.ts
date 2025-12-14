import request from 'supertest';
import app from '../app';
import pool from '../config/database';
import { initializeDatabase } from '../config/initDb';

describe('Sweets API', () => {
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await initializeDatabase();

    // Register regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'password123' });
    authToken = userResponse.body.token;

    // Register admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@example.com', password: 'password123', isAdmin: true });
    adminToken = adminResponse.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    // Clear sweets table before each test
    await pool.query('DELETE FROM sweets');
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet with valid authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 100
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Chocolate Bar');
      expect(response.body.category).toBe('Chocolate');
      expect(response.body.price).toBe('2.50');
      expect(response.body.quantity).toBe(100);
    });

    it('should not create sweet without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.50,
          quantity: 100
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate price is non-negative', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: -1,
          quantity: 100
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Add test sweets
      await pool.query(`
        INSERT INTO sweets (name, category, price, quantity) VALUES
        ('Chocolate Bar', 'Chocolate', 2.50, 100),
        ('Gummy Bears', 'Gummies', 1.99, 150)
      `);
    });

    it('should get all sweets with authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should not get sweets without authentication', async () => {
      const response = await request(app).get('/api/sweets');
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const result = await pool.query(`
        INSERT INTO sweets (name, category, price, quantity)
        VALUES ('Chocolate Bar', 'Chocolate', 2.50, 100)
        RETURNING id
      `);
      sweetId = result.rows[0].id;
    });

    it('should update sweet with valid authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 3.00, quantity: 150 });

      expect(response.status).toBe(200);
      expect(response.body.price).toBe('3.00');
      expect(response.body.quantity).toBe(150);
    });

    it('should not update sweet without authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ price: 3.00 });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .put('/api/sweets/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 3.00 });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const result = await pool.query(`
        INSERT INTO sweets (name, category, price, quantity)
        VALUES ('Chocolate Bar', 'Chocolate', 2.50, 100)
        RETURNING id
      `);
      sweetId = result.rows[0].id;
    });

    it('should delete sweet with admin authentication', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should not delete sweet with regular user authentication', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });

    it('should not delete sweet without authentication', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`);

      expect(response.status).toBe(401);
    });
  });
});
