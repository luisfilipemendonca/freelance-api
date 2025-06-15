import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import * as jobsController from '../../controllers/jobs.controller';
import { validateRequestBody } from '../../middlewares/validateRequestBody';
import { createJobDto, getJobDto, updateJobDto } from '../../dtos/jobs.dto';
import { validateRequestParams } from '../../middlewares/validateRequestParams';

const router = Router();

router.get('/', authenticate, jobsController.listJobs);

router.get('/:id', authenticate, validateRequestParams(getJobDto), jobsController.getJob);

router.get('/:id/proposals', authenticate, authorize('CLIENT'), validateRequestParams(getJobDto), jobsController.getJobProposals);

router.post('/', authenticate, authorize('CLIENT'), validateRequestBody(createJobDto), jobsController.create);

router.patch('/:id', authenticate, authorize('CLIENT'), validateRequestParams(getJobDto), validateRequestBody(updateJobDto), jobsController.updateJob);

router.delete('/:id', authenticate, authorize('CLIENT'), validateRequestParams(getJobDto), jobsController.deleteJob);

export default router;
