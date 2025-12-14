import { Request, Response } from 'express';
import { SweetModel } from '../models/sweet.model';

export class SweetsController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, price, quantity } = req.body;

      // Validate required fields
      if (!name || !category || price === undefined || quantity === undefined) {
        res.status(400).json({ error: 'Name, category, price, and quantity are required' });
        return;
      }

      // Validate price is non-negative
      if (price < 0) {
        res.status(400).json({ error: 'Price must be non-negative' });
        return;
      }

      // Validate quantity is non-negative
      if (quantity < 0) {
        res.status(400).json({ error: 'Quantity must be non-negative' });
        return;
      }

      const sweet = await SweetModel.create({ name, category, price, quantity });
      res.status(201).json(sweet);
    } catch (error) {
      console.error('Create sweet error:', error);
      res.status(500).json({ error: 'Failed to create sweet' });
    }
  }

  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const sweets = await SweetModel.findAll();
      res.status(200).json(sweets);
    } catch (error) {
      console.error('Get sweets error:', error);
      res.status(500).json({ error: 'Failed to retrieve sweets' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid sweet ID' });
        return;
      }

      const sweet = await SweetModel.findById(id);

      if (!sweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }

      res.status(200).json(sweet);
    } catch (error) {
      console.error('Get sweet error:', error);
      res.status(500).json({ error: 'Failed to retrieve sweet' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { name, category, price, quantity } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid sweet ID' });
        return;
      }

      // Validate price if provided
      if (price !== undefined && price < 0) {
        res.status(400).json({ error: 'Price must be non-negative' });
        return;
      }

      // Validate quantity if provided
      if (quantity !== undefined && quantity < 0) {
        res.status(400).json({ error: 'Quantity must be non-negative' });
        return;
      }

      const sweet = await SweetModel.update(id, { name, category, price, quantity });

      if (!sweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }

      res.status(200).json(sweet);
    } catch (error) {
      console.error('Update sweet error:', error);
      res.status(500).json({ error: 'Failed to update sweet' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid sweet ID' });
        return;
      }

      const deleted = await SweetModel.delete(id);

      if (!deleted) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }

      res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error) {
      console.error('Delete sweet error:', error);
      res.status(500).json({ error: 'Failed to delete sweet' });
    }
  }

  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, minPrice, maxPrice } = req.query;

      const searchParams = {
        name: name as string | undefined,
        category: category as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
      };

      const sweets = await SweetModel.search(searchParams);
      res.status(200).json(sweets);
    } catch (error) {
      console.error('Search sweets error:', error);
      res.status(500).json({ error: 'Failed to search sweets' });
    }
  }

  static async purchase(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid sweet ID' });
        return;
      }

      if (!quantity || quantity <= 0) {
        res.status(400).json({ error: 'Quantity must be a positive number' });
        return;
      }

      const sweet = await SweetModel.purchase(id, quantity);

      if (!sweet) {
        res.status(400).json({ error: 'Insufficient quantity or sweet not found' });
        return;
      }

      res.status(200).json(sweet);
    } catch (error) {
      console.error('Purchase sweet error:', error);
      res.status(500).json({ error: 'Failed to purchase sweet' });
    }
  }

  static async restock(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid sweet ID' });
        return;
      }

      if (!quantity || quantity <= 0) {
        res.status(400).json({ error: 'Quantity must be a positive number' });
        return;
      }

      const sweet = await SweetModel.restock(id, quantity);

      if (!sweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }

      res.status(200).json(sweet);
    } catch (error) {
      console.error('Restock sweet error:', error);
      res.status(500).json({ error: 'Failed to restock sweet' });
    }
  }
}
