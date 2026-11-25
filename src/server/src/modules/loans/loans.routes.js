import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { loansController } from './loans.controller.js';

const router = Router();

router.post('/checkout', authenticate, authorize('Librarian'), loansController.checkout);
router.post('/return', authenticate, authorize('Librarian'), loansController.returnBook);
router.post('/:id/renew', authenticate, authorize('Reader', 'Librarian'), loansController.renew);
router.get('/overdue', authenticate, authorize('Librarian'), loansController.listOverdue);

export default router;
