import { STUDENT_VOICE, materialContext } from './base.js';

export function buildFlashcardsPrompt({ material, topic, count = 10 }) {
  const system = `${STUDENT_VOICE}

You are writing revision flashcards.
Rules:
- Front: one question, term or formula. Never more than 15 words.
- Back: the answer plus a one-line reason or memory hook. Under 60 words.
- Cover the whole topic rather than repeating the same idea.

Respond with JSON only. No prose, no code fences. Shape:
{"cards":[{"id":"c1","front":"...","back":"...","topic":"..."}]}

${materialContext(material)}`;

  const user = material?.text
    ? `Create ${count} flashcards from the uploaded material${topic ? `, focusing on: ${topic}` : ''}.`
    : `Create ${count} flashcards on this topic: ${topic}`;

  return { system, messages: [{ role: 'user', content: user }] };
}
