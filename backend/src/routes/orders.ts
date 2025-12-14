import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET all orders for the authenticated user
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status } = req.query;

    let query = `
      SELECT o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
    `;
    const params: any[] = [userId];

    if (status && status !== 'All Orders') {
      query += ' AND o.status = $2';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET specific order with items
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orderId = req.params.id;

    // Get order
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Get order items
    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE new order
router.post('/', authenticate, async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const userId = (req as any).user.id;
    const {
      cartItems,
      totalAmount,
      shippingInfo
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone ||
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      res.status(400).json({ error: 'Shipping information is incomplete' });
      return;
    }

    await client.query('BEGIN');

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, total_amount, status,
        shipping_name, shipping_email, shipping_phone,
        shipping_address, shipping_city, shipping_zip_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        userId,
        totalAmount,
        'Processing',
        shippingInfo.fullName,
        shippingInfo.email,
        shippingInfo.phone,
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.zipCode
      ]
    );

    const orderId = orderResult.rows[0].id;

    // Insert order items and update sweet quantities
    for (const item of cartItems) {
      // Check if sweet has enough quantity
      const sweetResult = await client.query(
        'SELECT quantity FROM sweets WHERE id = $1',
        [item.sweet.id]
      );

      if (sweetResult.rows.length === 0) {
        throw new Error(`Sweet with id ${item.sweet.id} not found`);
      }

      const availableQuantity = sweetResult.rows[0].quantity;
      if (availableQuantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.sweet.name}. Available: ${availableQuantity}`);
      }

      // Insert order item
      await client.query(
        `INSERT INTO order_items (
          order_id, sweet_id, sweet_name, sweet_price, quantity, subtotal
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.sweet.id,
          item.sweet.name,
          item.sweet.price,
          item.quantity,
          Number(item.sweet.price) * item.quantity
        ]
      );

      // Decrease sweet quantity
      await client.query(
        'UPDATE sweets SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [item.quantity, item.sweet.id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      orderId: orderId
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  } finally {
    client.release();
  }
});

export default router;
