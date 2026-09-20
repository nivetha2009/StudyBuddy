import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

const uploadRoot = path.isAbsolute(config.uploads.dir)
  ? config.uploads.dir
  : path.resolve(process.cwd(), config.uploads.dir);

// On a read-only serverless filesystem this must not throw at import time,
// or every request to the function would fail during the cold start.
try {
  if (!fs.existsSync(uploadRoot)) {
    fs.mkdirSync(uploadRoot, { recursive: true });
  }
} catch (error) {
  logger.warn(`Could not create the upload directory at ${uploadRoot}:`, error.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const extAllowed = config.uploads.allowedExtensions.includes(ext);
  const mimeAllowed = config.uploads.allowedMimeTypes.includes(file.mimetype);

  if (!extAllowed || !mimeAllowed) {
    return cb(
      ApiError.badRequest(
        'Please upload a supported file: PDF, PPT, PPTX, DOC, DOCX, TXT or MD.',
        'UNSUPPORTED_FILE_TYPE'
      )
    );
  }
  return cb(null, true);
}

export const uploadSingleDocument = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.uploads.maxFileSizeBytes, files: 1 }
}).single('file');

export { uploadRoot };
