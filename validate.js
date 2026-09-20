import { ApiError } from '../utils/ApiError.js';

export function requireString(value, field, { min = 1, max = 8000 } = {}) {
  if (typeof value !== 'string' || value.trim().length < min) {
    throw ApiError.badRequest(`Please provide ${field}.`);
  }
  if (value.length > max) {
    throw ApiError.badRequest(`${field} is too long. Please shorten it and try again.`);
  }
  return value.trim();
}

export function optionalString(value, fallback = '', max = 8000) {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, max).trim();
}

export function clampNumber(value, { min, max, fallback }) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

export function pickOption(value, allowed, fallback) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  const match = allowed.find((option) => option.toLowerCase() === normalized);
  return match || fallback;
}

/** Small helper so controllers stay free of try/catch boilerplate. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
