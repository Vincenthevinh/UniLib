import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';

const router = Router();

router.get('/reader', dashboardController.getReader);
router.get('/librarian', dashboardController.getLibrarian);

export default router;
