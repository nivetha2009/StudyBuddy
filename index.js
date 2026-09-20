import { createApp } from './app.js';
import { config, isDemoMode } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

app.listen(config.port, () => {
  logger.info(`StudyBuddy API listening on http://localhost:${config.port}`);
  logger.info(`AI provider: ${config.ai.provider}${isDemoMode() ? ' (demo mode - no API key configured)' : ` (${config.ai.model})`}`);
  logger.info(`Allowed client origins: ${config.clientOrigins.join(', ')}`);
});

process.on('unhandledRejection', (reason) => logger.error('Unhandled rejection:', reason));
process.on('uncaughtException', (error) => logger.error('Uncaught exception:', error));
