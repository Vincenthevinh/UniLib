import { Router } from 'express';
import { usersController } from './users.controller.js';

const router = Router();

router.get('/', usersController.list);
router.post('/', usersController.create);
router.get('/:id', usersController.getById);
router.patch('/:id/status', usersController.updateStatus);

export default router;
