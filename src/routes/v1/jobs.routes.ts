import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import * as jobsController from '../../controllers/jobs.controller';
import { validateRequestBody } from '../../middlewares/validateRequestBody';
import { createJobDto, deleteJobDto } from '../../dtos/jobs.dto';
import { validateRequestParams } from '../../middlewares/validateRequestParams';

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

router.delete('/:id', authenticate, authorize('CLIENT'), validateRequestParams(deleteJobDto), jobsController.deleteJob);

export default router;
