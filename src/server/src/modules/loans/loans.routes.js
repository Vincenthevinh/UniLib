import { Router } from 'express';
import { loansController } from './loans.controller.js';

const router = Router();

router.post('/checkout', loansController.checkout);
router.post('/return', loansController.returnBook);
router.post('/:id/renew', loansController.renew);
router.get('/overdue', loansController.listOverdue);

export default router;
