import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { booksController } from './books.controller.js';

const router = Router();

router.get('/', booksController.list);
router.post('/', authenticate, authorize('Librarian'), booksController.create);
router.get('/:id', booksController.getById);
router.put('/:id', authenticate, authorize('Librarian'), booksController.update);
router.delete('/:id', authenticate, authorize('Librarian'), booksController.delete);

export default router;
