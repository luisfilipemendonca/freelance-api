import { Router } from 'express';
import ProposalsController from '../../controllers/proposals.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequestBody } from '../../middlewares/validateRequestBody';
import { createProposalDto, getProposalParamsDto } from '../../dtos/proposals.dto';
import { validateRequestParams } from '../../middlewares/validateRequestParams';

const router = Router();

router.post('/', authenticate, authorize('FREELANCER'), validateRequestBody(createProposalDto), ProposalsController.create);

router.get('/', authenticate, authorize('FREELANCER'), ProposalsController.index);

router.delete('/:id', authenticate, authorize('FREELANCER'), validateRequestParams(getProposalParamsDto), ProposalsController.delete);

export default router;
