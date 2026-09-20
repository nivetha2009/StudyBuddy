import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const provider = (process.env.AI_PROVIDER || 'demo').toLowerCase();
const apiKey = (process.env.AI_API_KEY || '').trim();

// Vercel (and most serverless hosts) expose a read-only filesystem apart from
// /tmp, so uploads must be written there when running as a function.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const defaultUploadDir = isServerless ? '/tmp/studybuddy-uploads' : 'uploads';

// On Vercel the deployment's own URL is the frontend origin, so allow it
// automatically alongside anything listed in CLIENT_ORIGIN.
const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

const clientOrigins = [
  ...(process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(','),
  vercelOrigin
]
  .map((origin) => (origin || '').trim())
  .filter(Boolean);

/**
 * Central place for every configurable value.
 * Nothing else in the codebase should read process.env directly.
 */
export const config = {
  port: toNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isServerless,

  clientOrigins,
  // CLIENT_ORIGIN=* disables the allow-list (fine when the API is same-origin).
  allowAllOrigins: clientOrigins.includes('*'),

  ai: {
    // Demo mode turns on automatically when no key is configured.
    provider: !apiKey || provider === 'demo' ? 'demo' : provider,
    requestedProvider: provider,
    apiKey,
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    baseUrl: (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, ''),
    maxTokens: toNumber(process.env.AI_MAX_TOKENS, 2000),
    temperature: toNumber(process.env.AI_TEMPERATURE, 0.4),
    timeoutMs: toNumber(process.env.AI_TIMEOUT_MS, 60000)
  },

  uploads: {
    dir: process.env.UPLOAD_DIR || defaultUploadDir,
    maxFileSizeBytes: toNumber(process.env.MAX_FILE_SIZE_MB, 15) * 1024 * 1024,
    maxFileSizeMb: toNumber(process.env.MAX_FILE_SIZE_MB, 15),
    allowedExtensions: ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt', '.md'],
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/octet-stream'
    ]
  },

  rateLimit: {
    windowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MINUTES, 15) * 60 * 1000,
    max: toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 120)
  }
};

export const isDemoMode = () => config.ai.provider === 'demo';
