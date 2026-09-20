import { STUDENT_VOICE, materialContext } from './base.js';

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'HOTS'];
export const QUESTION_TYPES = ['Conceptual', 'Application-based', 'Logical', 'Case-based', 'Assertion & Reason'];

const DIFFICULTY_NOTES = {
  Easy: 'Recall level. One step of thinking.',
  Medium: 'Understanding and simple application.',
  Hard: 'Multi-step reasoning or a tricky distinction between close options.',
  HOTS: 'Higher order thinking: analysis, evaluation, transfer to an unfamiliar situation.'
};

const TYPE_NOTES = {
  Conceptual: 'Test whether the idea itself is understood.',
  'Application-based': 'Put the idea into a realistic situation the student must resolve.',
  Logical: 'Require a chain of reasoning or elimination.',
  'Case-based': 'Give a short scenario of 2-3 sentences, then ask about it.',
  'Assertion & Reason': 'Give an Assertion (A) and a Reason (R). Options must be the standard four: both true and R explains A; both true but R does not explain A; A true R false; A false R true.'
};

export function buildMcqPrompt({ material, topic, count = 5, difficulty = 'Medium', type = 'Conceptual' }) {
  const system = `${STUDENT_VOICE}

You are writing multiple choice questions for exam practice.
Difficulty: ${difficulty}. ${DIFFICULTY_NOTES[difficulty] || ''}
Question type: ${type}. ${TYPE_NOTES[type] || ''}

Rules:
- Exactly 4 options per question, only one clearly correct.
- Wrong options must be believable, not silly.
- The explanation says why the correct option is right AND why the tempting wrong one is wrong.
- "topic" is the specific sub-topic the question tests, so weak areas can be reported back.

Respond with JSON only. No prose, no code fences. Shape:
{"questions":[{"id":"q1","question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"...","topic":"...","difficulty":"${difficulty}"}]}

${materialContext(material)}`;

  const user = material?.text
    ? `Create ${count} ${difficulty} ${type} MCQs from the uploaded material${topic ? `, focusing on: ${topic}` : ''}.`
    : `Create ${count} ${difficulty} ${type} MCQs on this topic: ${topic}`;

  return { system, messages: [{ role: 'user', content: user }] };
}
