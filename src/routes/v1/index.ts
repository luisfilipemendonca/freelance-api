import { Router } from 'express';
import authRoutes from './auth.routes';
import jobsRoutes from './jobs.routes';
import usersRoutes from './users.routes';
import proposalsRoutes from './proposals.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/users', usersRoutes);
router.use('/proposals', proposalsRoutes);

export default router;
