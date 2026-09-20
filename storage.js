const PREFIX = 'studybuddy:';

export function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage can be full or blocked; the app still works without it */
  }
}

export function clearStore(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
