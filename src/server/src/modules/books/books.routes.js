import { Router } from 'express';
import { booksController } from './books.controller.js';

const router = Router();

router.get('/', booksController.list);
router.post('/', booksController.create);
router.get('/:id', booksController.getById);
router.put('/:id', booksController.update);
router.delete('/:id', booksController.delete);

export default router;
