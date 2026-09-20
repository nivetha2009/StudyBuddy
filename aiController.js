import { asyncHandler, requireString, optionalString, clampNumber, pickOption } from '../middleware/validate.js';
import { ApiError } from '../utils/ApiError.js';
import { aiService } from '../services/aiService.js';
import { materialStore } from '../services/materialStore.js';
import { TUTOR_MODES } from '../prompts/tutor.js';
import { DIFFICULTIES, QUESTION_TYPES } from '../prompts/mcq.js';
import { NOTE_STYLES } from '../prompts/notes.js';

/** Resolves an optional materialId into the stored material. */
function resolveMaterial(materialId) {
  if (!materialId) return null;
  return materialStore.require(materialId);
}

/** Either a material or a topic is needed, otherwise there is nothing to work from. */
function requireSource({ material, topic }, what) {
  if (!material && !topic) {
    throw ApiError.badRequest(`Choose an uploaded material or type a topic to ${what}.`, 'NO_SOURCE');
  }
}

export const getStatus = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: aiService.status() });
});

export const chat = asyncHandler(async (req, res) => {
  const message = requireString(req.body.message, 'a question', { max: 4000 });
  const mode = pickOption(req.body.mode, Object.keys(TUTOR_MODES), 'simple');
  const history = Array.isArray(req.body.history) ? req.body.history.slice(-10) : [];
  const material = resolveMaterial(req.body.materialId);

  const result = await aiService.chat({ message, history, mode, material });
  res.json({ ok: true, data: { answer: result.text, demo: result.demo, mode } });
});

export const generateNotes = asyncHandler(async (req, res) => {
  const material = resolveMaterial(req.body.materialId);
  const topic = optionalString(req.body.topic, '', 300);
  requireSource({ material, topic }, 'generate notes');

  const style = pickOption(req.body.style, Object.keys(NOTE_STYLES), 'quick');
  const result = await aiService.notes({ material, topic, style });

  res.json({ ok: true, data: { notes: result.text, style, demo: result.demo } });
});

export const generateSummary = asyncHandler(async (req, res) => {
  const material = resolveMaterial(req.body.materialId);
  const topic = optionalString(req.body.topic, '', 300);
  requireSource({ material, topic }, 'generate a summary');

  const result = await aiService.summary({ material, topic });
  res.json({ ok: true, data: { summary: result.text, demo: result.demo } });
});

export const generateMcqs = asyncHandler(async (req, res) => {
  const material = resolveMaterial(req.body.materialId);
  const topic = optionalString(req.body.topic, '', 300);
  requireSource({ material, topic }, 'generate questions');

  const count = clampNumber(req.body.count, { min: 1, max: 20, fallback: 5 });
  const difficulty = pickOption(req.body.difficulty, DIFFICULTIES, 'Medium');
  const type = pickOption(req.body.type, QUESTION_TYPES, 'Conceptual');

  const result = await aiService.mcq({ material, topic, count, difficulty, type });
  res.json({
    ok: true,
    data: { questions: result.data.questions, difficulty, type, demo: result.demo }
  });
});

export const generateFlashcards = asyncHandler(async (req, res) => {
  const material = resolveMaterial(req.body.materialId);
  const topic = optionalString(req.body.topic, '', 300);
  requireSource({ material, topic }, 'generate flashcards');

  const count = clampNumber(req.body.count, { min: 1, max: 30, fallback: 10 });
  const result = await aiService.flashcards({ material, topic, count });

  res.json({ ok: true, data: { cards: result.data.cards, demo: result.demo } });
});

export const generateExamPack = asyncHandler(async (req, res) => {
  const subject = requireString(req.body.subject, 'a subject', { max: 200 });
  const material = resolveMaterial(req.body.materialId);

  const result = await aiService.examPack({
    subject,
    material,
    module: optionalString(req.body.module, '', 200),
    topics: optionalString(req.body.topics, '', 1000),
    examDate: optionalString(req.body.examDate, '', 40),
    marksPattern: optionalString(req.body.marksPattern, '', 300),
    pattern: optionalString(req.body.pattern, '', 300)
  });

  res.json({ ok: true, data: { pack: result.text, demo: result.demo } });
});
