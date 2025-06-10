import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import * as jobsController from '../../controllers/jobs.controller';
import { validateRequestBody } from '../../middlewares/validateRequestBody';
import { createJobDto } from '../../dtos/jobs.dto';

const router = Router();

router.get('/', (req, res) => {
  res.send('Jobs list');
});

router.get('/:id', (req, res) => {
  res.send(`Job ${req.params.id}`);
});

router.post('/', authenticate, authorize('CLIENT'), validateRequestBody(createJobDto), jobsController.create);

router.patch('/:id', (req, res) => {
  res.send(`Job ${req.params.id} updated`);
});

router.delete('/:id', (req, res) => {
  res.send(`Job ${req.params.id} deleted`);
});

export default router;
