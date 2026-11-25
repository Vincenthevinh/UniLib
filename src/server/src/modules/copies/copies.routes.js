import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { copiesController } from './copies.controller.js';

const router = Router();

router.get('/', copiesController.list);
router.post('/', authenticate, authorize('Librarian'), copiesController.create);
router.get('/:id', copiesController.getById);
router.patch('/:id', authenticate, authorize('Librarian'), copiesController.update);
router.delete('/:id', authenticate, authorize('Librarian'), copiesController.delete);

export default router;
