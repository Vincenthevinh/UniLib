import { Router } from 'express';
import { copiesController } from './copies.controller.js';

const router = Router();

router.get('/', copiesController.list);
router.post('/', copiesController.create);
router.get('/:id', copiesController.getById);
router.patch('/:id', copiesController.update);
router.delete('/:id', copiesController.delete);

export default router;
