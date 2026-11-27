import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { dashboardController } from './dashboard.controller.js';

const router = Router();

router.get('/reader', authenticate, authorize('Reader'), dashboardController.getReader);
router.get('/librarian', authenticate, authorize('Librarian'), dashboardController.getLibrarian);
router.get('/overdue', authenticate, authorize('Librarian'), dashboardController.getOverdue);

export default router;
