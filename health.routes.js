import { Router } from 'express';
import { config, isDemoMode } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    data: {
      service: 'studybuddy-api',
      status: 'up',
      environment: config.nodeEnv,
      demoMode: isDemoMode(),
      time: new Date().toISOString()
    }
  });
});

export default router;
