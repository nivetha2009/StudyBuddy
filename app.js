import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    cors({
      origin(origin, callback) {
        // No Origin header means same-origin, curl or a server-to-server call.
        if (!origin || config.allowAllOrigins || config.clientOrigins.includes(origin)) {
          return callback(null, true);
        }
        // Reply without CORS headers instead of throwing: throwing here would
        // surface as a 500 rather than a normal blocked-by-browser response.
        return callback(null, false);
      }
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  if (!config.isProduction) {
    app.use(morgan('dev'));
  }

  app.use('/api', apiLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
