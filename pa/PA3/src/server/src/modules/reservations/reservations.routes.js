import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { reservationsController } from './reservations.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('Reader'), reservationsController.create);
router.get('/', authorize('Reader', 'Librarian'), reservationsController.list);
router.delete('/:id', authorize('Reader'), reservationsController.cancel);
router.post('/:id/pickup', authorize('Librarian'), reservationsController.pickup);

export default router;
