import { Router } from 'express';
import authRoutes from './auth.routes';
import jobsRoutes from './jobs.routes';
import usersRoutes from './users.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/users', usersRoutes);

export default router;
