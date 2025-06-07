import { Router } from 'express';
import * as authController from '../../controllers/auth.controller';
import { validateRequestBody } from '../../middlewares/validateRequestBody';
import { loginDto, registerDto } from '../../dtos/auth.dto';

const router = Router();

router.post('/register', validateRequestBody(registerDto), authController.register);

router.post('/login', validateRequestBody(loginDto), authController.login);

export default router;
