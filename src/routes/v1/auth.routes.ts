import { Router } from 'express';
import * as authController from '../../controllers/auth.controller';
import { validateRequestBody } from '../../middlewares/validateRequestBody';
import { loginDto, registerDto } from '../../dtos/auth.dto';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { Role } from '@prisma/client';

const router = Router();

router.post('/register', validateRequestBody(registerDto), authController.register);

// router.get('/test', authenticate, authorize(Role.FREELANCER), authController.register);
router.get('/test', authController.test);

router.post('/login', validateRequestBody(loginDto), authController.login);

router.post('/logout', authController.logout);

router.post('/refresh', authController.refresh);

export default router;
