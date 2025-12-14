import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET all payment methods for the authenticated user
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query(
      `SELECT id, type, card_brand, last4, expiry_month, expiry_year, is_default, created_at
       FROM payment_methods
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADD new payment method
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { cardBrand, last4, expiryMonth, expiryYear, isDefault } = req.body;

    if (!cardBrand || !last4 || !expiryMonth || !expiryYear) {
      res.status(400).json({ error: 'Card details are incomplete' });
      return;
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await pool.query(
        'UPDATE payment_methods SET is_default = FALSE WHERE user_id = $1',
        [userId]
      );
    }

    const result = await pool.query(
      `INSERT INTO payment_methods (user_id, type, card_brand, last4, expiry_month, expiry_year, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, type, card_brand, last4, expiry_month, expiry_year, is_default`,
      [userId, 'card', cardBrand, last4, expiryMonth, expiryYear, isDefault || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// SET payment method as default
router.put('/:id/default', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const paymentMethodId = req.params.id;

    // Check if payment method belongs to user
    const checkResult = await pool.query(
      'SELECT id FROM payment_methods WHERE id = $1 AND user_id = $2',
      [paymentMethodId, userId]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Payment method not found' });
      return;
    }

    // Unset all other defaults
    await pool.query(
      'UPDATE payment_methods SET is_default = FALSE WHERE user_id = $1',
      [userId]
    );

    // Set this one as default
    await pool.query(
      'UPDATE payment_methods SET is_default = TRUE WHERE id = $1',
      [paymentMethodId]
    );

    res.json({ message: 'Payment method set as default' });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE payment method
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const paymentMethodId = req.params.id;

    // Check if payment method belongs to user
    const result = await pool.query(
      'DELETE FROM payment_methods WHERE id = $1 AND user_id = $2 RETURNING id',
      [paymentMethodId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Payment method not found' });
      return;
    }

    res.json({ message: 'Payment method removed' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
