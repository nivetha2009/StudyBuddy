import { ApiError } from './ApiError.js';

/**
 * Language models sometimes wrap JSON in prose or code fences.
 * This pulls the first valid JSON object or array out of a string.
 */
export function extractJson(raw) {
  if (!raw || typeof raw !== 'string') {
    throw ApiError.unavailable('The AI returned an empty response. Please try again.');
  }

  const cleaned = raw
    .replace(/```json/gi, '```')
    .split('```')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const candidates = [raw.trim(), ...cleaned];

  for (const candidate of candidates) {
    const direct = tryParse(candidate);
    if (direct !== undefined) return direct;

    const sliced = sliceBalanced(candidate);
    if (sliced !== undefined) return sliced;
  }

  throw ApiError.unavailable('The AI response could not be read. Please try generating it again.');
}

function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function sliceBalanced(text) {
  const openers = ['{', '['];
  for (const opener of openers) {
    const closer = opener === '{' ? '}' : ']';
    const start = text.indexOf(opener);
    const end = text.lastIndexOf(closer);
    if (start !== -1 && end > start) {
      const parsed = tryParse(text.slice(start, end + 1));
      if (parsed !== undefined) return parsed;
    }
  }
  return undefined;
}
