import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = Router();

// FR-F01-04 & BR-10: All user management endpoints strictly restricted to Administrator
router.use(authenticate, authorize('Administrator'));

router.get('/', usersController.list);
router.post('/', usersController.create);
router.get('/:id', usersController.getById);
router.patch('/:id', usersController.update);
router.patch('/:id/status', usersController.updateStatus);

export default router;
