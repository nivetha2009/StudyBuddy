import { config, isDemoMode } from '../config/env.js';
import { extractJson } from '../utils/json.js';
import { ApiError } from '../utils/ApiError.js';
import { truncate } from '../utils/text.js';
import { demoProvider } from './providers/demo.js';
import { openaiProvider } from './providers/openai.js';
import { anthropicProvider } from './providers/anthropic.js';
import { geminiProvider } from './providers/gemini.js';
import { buildTutorMessages, TUTOR_MODES } from '../prompts/tutor.js';
import { buildNotesPrompt, buildSummaryPrompt } from '../prompts/notes.js';
import { buildMcqPrompt } from '../prompts/mcq.js';
import { buildFlashcardsPrompt } from '../prompts/flashcards.js';
import { buildExamPrompt } from '../prompts/exam.js';

const providers = {
  demo: demoProvider,
  openai: openaiProvider,
  anthropic: anthropicProvider,
  gemini: geminiProvider
};

function activeProvider() {
  const provider = providers[config.ai.provider];
  if (!provider) {
    throw ApiError.unavailable('The configured AI provider is not supported. Check AI_PROVIDER in your .env file.');
  }
  return provider;
}

/** Trim the extracted document text so prompts stay a reasonable size. */
function prepareMaterial(material) {
  if (!material) return null;
  return { name: material.name, text: truncate(material.text, 18000) };
}

async function run({ task, prompt, json = false, demoArgs = {}, material }) {
  if (isDemoMode()) {
    const result = await demoProvider.generate({ task, ...demoArgs });
    return json
      ? { data: result.json, demo: true, provider: 'demo' }
      : { text: result.text, demo: true, provider: 'demo' };
  }

  const provider = activeProvider();
  const raw = await provider.generate({ ...prompt, json });

  if (!raw || !String(raw).trim()) {
    throw ApiError.unavailable('The AI returned an empty answer. Please try again.');
  }

  return json
    ? { data: extractJson(raw), demo: false, provider: provider.name }
    : { text: String(raw).trim(), demo: false, provider: provider.name };
}

export const aiService = {
  status() {
    return {
      demoMode: isDemoMode(),
      provider: config.ai.provider,
      model: isDemoMode() ? 'demo' : config.ai.model,
      modes: Object.entries(TUTOR_MODES).map(([id, value]) => ({ id, label: value.label }))
    };
  },

  async chat({ message, history, mode, material }) {
    const prepared = prepareMaterial(material);
    return run({
      task: 'chat',
      json: false,
      material: prepared,
      demoArgs: { prompt: message, mode },
      prompt: buildTutorMessages({ message, history, mode, material: prepared })
    });
  },

  async notes({ material, topic, style }) {
    const prepared = prepareMaterial(material);
    return run({
      task: 'notes',
      json: false,
      demoArgs: { topic: topic || material?.name, style },
      prompt: buildNotesPrompt({ material: prepared, topic, style })
    });
  },

  async summary({ material, topic }) {
    const prepared = prepareMaterial(material);
    return run({
      task: 'summary',
      json: false,
      demoArgs: { topic: topic || material?.name },
      prompt: buildSummaryPrompt({ material: prepared, topic })
    });
  },

  async mcq({ material, topic, count, difficulty, type }) {
    const prepared = prepareMaterial(material);
    const result = await run({
      task: 'mcq',
      json: true,
      demoArgs: { count, difficulty, type, topic: topic || material?.name },
      prompt: buildMcqPrompt({ material: prepared, topic, count, difficulty, type })
    });

    const questions = normalizeQuestions(result.data, difficulty, type);
    return { ...result, data: { questions } };
  },

  async flashcards({ material, topic, count }) {
    const prepared = prepareMaterial(material);
    const result = await run({
      task: 'flashcards',
      json: true,
      demoArgs: { count, topic: topic || material?.name },
      prompt: buildFlashcardsPrompt({ material: prepared, topic, count })
    });

    const cards = normalizeCards(result.data);
    return { ...result, data: { cards } };
  },

  async examPack(payload) {
    const prepared = prepareMaterial(payload.material);
    return run({
      task: 'exam',
      json: false,
      demoArgs: { subject: payload.subject, topics: payload.topics },
      prompt: buildExamPrompt({ ...payload, material: prepared })
    });
  }
};

function normalizeQuestions(data, difficulty, type) {
  const list = Array.isArray(data) ? data : data?.questions;
  if (!Array.isArray(list) || list.length === 0) {
    throw ApiError.unavailable('No questions could be generated. Try a different topic or fewer questions.');
  }

  return list
    .map((item, index) => {
      const options = Array.isArray(item.options) ? item.options.map(String).slice(0, 4) : [];
      if (options.length < 2) return null;

      let correctIndex = Number(item.correctIndex);
      if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
        const byText = options.findIndex((option) => option === item.answer);
        correctIndex = byText >= 0 ? byText : 0;
      }

      return {
        id: String(item.id || `q${index + 1}`),
        question: String(item.question || '').trim(),
        options,
        correctIndex,
        explanation: String(item.explanation || 'No explanation was provided for this question.').trim(),
        topic: String(item.topic || 'General').trim(),
        difficulty: String(item.difficulty || difficulty || 'Medium'),
        type: String(item.type || type || 'Conceptual')
      };
    })
    .filter((item) => item && item.question);
}

function normalizeCards(data) {
  const list = Array.isArray(data) ? data : data?.cards;
  if (!Array.isArray(list) || list.length === 0) {
    throw ApiError.unavailable('No flashcards could be generated. Try a different topic.');
  }

  return list
    .map((item, index) => ({
      id: String(item.id || `c${index + 1}`),
      front: String(item.front || item.question || '').trim(),
      back: String(item.back || item.answer || '').trim(),
      topic: String(item.topic || 'General').trim()
    }))
    .filter((card) => card.front && card.back);
}
