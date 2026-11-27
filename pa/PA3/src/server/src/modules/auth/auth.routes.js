import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// Public authentication routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected user profile route
router.get('/me', authenticate, authController.getMe);

export default router;
