import { Router } from 'express';
import healthRoutes from './health.routes.js';
import aiRoutes from './ai.routes.js';
import materialRoutes from './material.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/ai', aiRoutes);
router.use('/materials', materialRoutes);

export default router;
