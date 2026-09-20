import multer from 'multer';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    error: { code: 'ROUTE_NOT_FOUND', message: 'That page or action does not exist.' }
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `That file is larger than ${config.uploads.maxFileSizeMb} MB. Please upload a smaller file.`
        : 'Your file could not be uploaded. Please try again.';
    return res.status(413).json({ ok: false, error: { code: err.code, message } });
  }

  if (err?.isApiError) {
    return res.status(err.status).json({ ok: false, error: { code: err.code, message: err.message } });
  }

  logger.error(err);
  return res.status(500).json({
    ok: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Something went wrong. Please try again.'
    }
  });
}
