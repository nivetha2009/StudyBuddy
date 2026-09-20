import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

const handler = (req, res) => {
  res.status(429).json({
    ok: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'You are sending requests very quickly. Take a short break and try again.'
    }
  });
};

/** Applied to every /api route. */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

/** Tighter limit for the expensive AI endpoints. */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});
