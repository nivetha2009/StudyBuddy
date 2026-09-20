/**
 * Every network call the browser makes goes through this module.
 * The browser never talks to an AI provider directly, and never sees an API key.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const FRIENDLY_FALLBACK = 'Something went wrong. Please try again.';

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers: isForm ? undefined : { 'Content-Type': 'application/json' },
      body: isForm ? body : body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('We could not reach StudyBuddy. Check your connection and try again.');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error?.message || FRIENDLY_FALLBACK);
  }

  return payload?.data;
}

export const api = {
  health: () => request('/health'),
  aiStatus: () => request('/ai/status'),

  chat: (payload) => request('/ai/chat', { method: 'POST', body: payload }),
  notes: (payload) => request('/ai/notes', { method: 'POST', body: payload }),
  summary: (payload) => request('/ai/summary', { method: 'POST', body: payload }),
  mcqs: (payload) => request('/ai/mcqs', { method: 'POST', body: payload }),
  flashcards: (payload) => request('/ai/flashcards', { method: 'POST', body: payload }),
  examPack: (payload) => request('/ai/exam-pack', { method: 'POST', body: payload }),

  listMaterials: () => request('/materials'),
  getMaterial: (id) => request(`/materials/${id}`),
  deleteMaterial: (id) => request(`/materials/${id}`, { method: 'DELETE' }),
  uploadMaterial: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/materials', { method: 'POST', body: form, isForm: true });
  }
};
