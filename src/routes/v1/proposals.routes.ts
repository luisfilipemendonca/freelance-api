import { Router } from 'express';
import ProposalsController from '../../controllers/proposals.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequestBody } from '../../middlewares/validateRequestBody';
import { createProposalDto } from '../../dtos/proposals.dto';

const router = Router();

router.post('/', authenticate, authorize('FREELANCER'), validateRequestBody(createProposalDto), ProposalsController.create);

export default router;
