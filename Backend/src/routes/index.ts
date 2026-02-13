import { Router } from 'express';
import healthRoutes from './health.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/reports', reportRoutes);

export default router;
