import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { validateRegistration, validateLogin } from '../utils/validation';
import { generateToken } from '../utils/jwt';
import { AuthResponse } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, isAdmin } = req.body;

      // Validate input
      const validationError = validateRegistration(email, password);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
      }

      // Create user
      const user = await UserModel.create({ email, password, isAdmin });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin
      });

      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.is_admin
        }
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      const validationError = validateLogin(email, password);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Verify password
      const isPasswordValid = await UserModel.comparePassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin
      });

      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.is_admin
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }
}
