import { STUDENT_VOICE, materialContext } from './base.js';

export const NOTE_STYLES = {
  quick: 'Quick revision notes: only the essentials, heavy on bullet points, readable in five minutes.',
  detailed: 'Detailed notes: full coverage of every section of the material with explanations.',
  beginner: 'Beginner explanation: assume no background, define everything, use simple analogies.',
  exam: 'Exam notes: organised around what is likely to be asked, with model points and keywords an examiner rewards.'
};

export function buildNotesPrompt({ material, topic, style = 'quick' }) {
  const styleInstruction = NOTE_STYLES[style] || NOTE_STYLES.quick;

  const system = `${STUDENT_VOICE}

You are writing study notes. Style: ${styleInstruction}

Return Markdown only, structured exactly like this:
# <Title>
## <Section heading>
### <Sub-heading where useful>
- bullet points

Every set of notes must include these sections, in this order:
## Overview
## Key concepts
## Definitions
## Worked examples
## Important points to remember
## Key terms
## Possible exam questions

${materialContext(material)}`;

  const user = material?.text
    ? `Write ${style} notes from the uploaded material${topic ? ` focusing on: ${topic}` : ''}.`
    : `Write ${style} notes on this topic: ${topic}`;

  return { system, messages: [{ role: 'user', content: user }] };
}

export function buildSummaryPrompt({ material, topic }) {
  const system = `${STUDENT_VOICE}

Write a summary in Markdown with: a two-sentence overview, "## Main ideas" (5-8 bullets), and "## In one line" (a single sentence a student can memorise).

${materialContext(material)}`;

  const user = material?.text
    ? 'Summarize the uploaded material.'
    : `Summarize this topic: ${topic}`;

  return { system, messages: [{ role: 'user', content: user }] };
}
