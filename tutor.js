import { STUDENT_VOICE, materialContext } from './base.js';

export const TUTOR_MODES = {
  simple: {
    label: 'Explain simply',
    instruction: 'Explain as if the student is completely new to the topic. Use an everyday analogy and keep it under 250 words.'
  },
  detailed: {
    label: 'Explain in detail',
    instruction: 'Give a thorough explanation: definition, how it works, why it matters, and common misunderstandings.'
  },
  example: {
    label: 'Give an example',
    instruction: 'Lead with one worked example, solved step by step, then a one-line summary of the idea behind it.'
  },
  exam: {
    label: 'Exam answer',
    instruction: 'Write a model exam answer: a crisp definition, numbered points with sub-points, a diagram description if useful, and a conclusion. Mark the points an examiner looks for.'
  },
  summary: {
    label: 'Summarize',
    instruction: 'Summarize into 5-8 tight bullet points a student can revise in two minutes.'
  },
  quizme: {
    label: 'Ask me questions',
    instruction: 'Do not explain. Ask the student 4 questions on this topic, one at a time in a numbered list, moving from recall to application. Invite them to answer and say you will check their answers.'
  }
};

export function buildTutorMessages({ message, history = [], mode = 'simple', material }) {
  const modeConfig = TUTOR_MODES[mode] || TUTOR_MODES.simple;

  const system = `${STUDENT_VOICE}

Answer style for this request: ${modeConfig.instruction}

${materialContext(material)}`;

  const messages = history
    .filter((turn) => turn && typeof turn.content === 'string')
    .slice(-10)
    .map((turn) => ({
      role: turn.role === 'assistant' ? 'assistant' : 'user',
      content: turn.content.slice(0, 4000)
    }));

  messages.push({ role: 'user', content: message });

  return { system, messages };
}
