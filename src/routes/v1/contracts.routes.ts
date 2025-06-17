import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequestParams } from '../../middlewares/validateRequestParams';
import ContractsController from '../../controllers/contracts.controller';
import { getContractParams } from '../../dtos/contracts.dto';

const router = Router();

router.post('/:id/accept', authenticate, authorize('FREELANCER'), validateRequestParams(getContractParams), ContractsController.accept);

export default router;
