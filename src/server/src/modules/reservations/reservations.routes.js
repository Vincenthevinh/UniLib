import { Router } from 'express';
import { reservationsController } from './reservations.controller.js';

const router = Router();

router.post('/', reservationsController.create);
router.get('/', reservationsController.list);
router.delete('/:id', reservationsController.cancel);
router.post('/:id/pickup', reservationsController.pickup);

export default router;
