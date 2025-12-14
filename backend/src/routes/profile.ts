import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';

const router = Router();

// GET user profile
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Get user and profile data
    const userResult = await pool.query(
      'SELECT id, email, is_admin FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const profileResult = await pool.query(
      'SELECT full_name, phone, address, city, zip_code FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    const user = userResult.rows[0];
    const profile = profileResult.rows[0] || {
      full_name: '',
      phone: '',
      address: '',
      city: '',
      zip_code: ''
    };

    res.json({
      ...user,
      ...profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE user profile
router.put('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { full_name, phone, address, city, zip_code } = req.body;

    // Check if profile exists
    const existingProfile = await pool.query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (existingProfile.rows.length === 0) {
      // Create new profile
      await pool.query(
        `INSERT INTO user_profiles (user_id, full_name, phone, address, city, zip_code)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, full_name, phone, address, city, zip_code]
      );
    } else {
      // Update existing profile
      await pool.query(
        `UPDATE user_profiles
         SET full_name = $1, phone = $2, address = $3, city = $4, zip_code = $5, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6`,
        [full_name, phone, address, city, zip_code, userId]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CHANGE password
router.post('/change-password', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current and new passwords are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    // Get current password hash
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    if (!validPassword) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
