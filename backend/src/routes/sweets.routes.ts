import { Router } from 'express';
import { SweetsController } from '../controllers/sweets.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Sweets CRUD routes
router.post('/', SweetsController.create);
router.get('/', SweetsController.getAll);
router.get('/search', SweetsController.search);
router.get('/:id', SweetsController.getById);
router.put('/:id', SweetsController.update);
router.delete('/:id', requireAdmin, SweetsController.delete);

// Inventory routes
router.post('/:id/purchase', SweetsController.purchase);
router.post('/:id/restock', requireAdmin, SweetsController.restock);

export default router;
