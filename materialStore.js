import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { readingMinutes, wordCount } from '../utils/text.js';
import { logger } from '../utils/logger.js';

/**
 * In-memory store for uploaded study materials.
 *
 * Deliberately simple so the app runs with zero setup. Swap the three functions
 * below for a database (Postgres, Mongo, Supabase) when you need materials to
 * survive a server restart or be shared between users.
 */
const materials = new Map();
const MAX_MATERIALS = 50;

if (config.isServerless) {
  logger.warn(
    'Running serverless: uploaded materials live in one function instance only and can disappear between requests. Use a database or a always-on host for reliable uploads.'
  );
}

export const materialStore = {
  create({ name, type, sizeBytes, text, pages, storedPath }) {
    if (materials.size >= MAX_MATERIALS) {
      const oldestKey = materials.keys().next().value;
      materialStore.remove(oldestKey);
    }

    const id = crypto.randomUUID();
    const record = {
      id,
      name,
      type,
      sizeBytes,
      pages,
      text,
      storedPath,
      words: wordCount(text),
      readingMinutes: readingMinutes(text),
      uploadedAt: new Date().toISOString()
    };

    materials.set(id, record);
    return materialStore.toPublic(record);
  },

  get(id) {
    return materials.get(id) || null;
  },

  require(id) {
    const material = materialStore.get(id);
    if (!material) throw ApiError.notFound();
    return material;
  },

  list() {
    return [...materials.values()]
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .map(materialStore.toPublic);
  },

  async remove(id) {
    const material = materials.get(id);
    if (!material) return false;
    materials.delete(id);
    if (material.storedPath) {
      try {
        await fs.unlink(material.storedPath);
      } catch (error) {
        logger.warn('Could not delete stored file', error.message);
      }
    }
    return true;
  },

  /** The shape sent to the browser: everything except the full extracted text. */
  toPublic(material) {
    const { text, storedPath, ...rest } = material;
    return { ...rest, preview: text.slice(0, 400) };
  }
};
