/** Collapse whitespace produced by PDF and slide extraction. */
export function normalizeText(input = '') {
  return String(input)
    .replace(/\r/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Keep prompts within a sane size so requests stay fast and cheap. */
export function truncate(text = '', maxChars = 18000) {
  const value = String(text);
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n\n[Material truncated for length. ${value.length - maxChars} more characters were not included.]`;
}

export function wordCount(text = '') {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/** Rough reading-time estimate shown next to uploaded materials. */
export function readingMinutes(text = '') {
  return Math.max(1, Math.round(wordCount(text) / 220));
}
