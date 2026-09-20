import { config } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';

/** fetch with a timeout and uniform, student-safe error messages. */
export async function postJson(url, { headers = {}, body }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.ai.timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const text = await response.text();

    if (!response.ok) {
      logger.error('AI provider error', response.status, text.slice(0, 500));
      if (response.status === 401 || response.status === 403) {
        throw ApiError.unavailable('The AI service rejected the API key. Check the key in your server .env file.');
      }
      if (response.status === 429) {
        throw ApiError.unavailable('The AI service is busy right now. Please try again in a minute.');
      }
      throw ApiError.unavailable();
    }

    try {
      return JSON.parse(text);
    } catch {
      throw ApiError.unavailable();
    }
  } catch (error) {
    if (error?.isApiError) throw error;
    if (error?.name === 'AbortError') {
      throw ApiError.unavailable('The AI took too long to answer. Please try a shorter request.');
    }
    logger.error('AI request failed', error);
    throw ApiError.unavailable();
  } finally {
    clearTimeout(timer);
  }
}
