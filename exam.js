import { STUDENT_VOICE, materialContext } from './base.js';

export function buildExamPrompt({ material, subject, module: moduleName, topics, examDate, pattern, marksPattern }) {
  const system = `${STUDENT_VOICE}

You are building an exam preparation pack.

Return Markdown only, using exactly these headings in this order:
# <Subject> — Exam pack
## Study plan
## 2-mark questions
## 5-mark questions
## 10-mark questions
## Important definitions
## Important concepts
## Application questions
## HOTS questions
## Revision checklist

Rules:
- Number every question.
- Under "Study plan", work backwards from the exam date and give a day-by-day plan. If no date is given, give a 7-day plan.
- Match the marks pattern the student describes: a 2-mark answer is 2-3 lines, a 5-mark answer has 4-5 points, a 10-mark answer has headings and a diagram suggestion. Show the expected answer length next to each question in brackets.
- The revision checklist is a Markdown task list using "- [ ]".

${materialContext(material)}`;

  const details = [
    `Subject: ${subject}`,
    moduleName ? `Module/unit: ${moduleName}` : null,
    topics ? `Topics: ${topics}` : null,
    examDate ? `Exam date: ${examDate} (today is ${new Date().toISOString().slice(0, 10)})` : null,
    marksPattern ? `Marks pattern: ${marksPattern}` : null,
    pattern ? `University/college exam pattern: ${pattern}` : null
  ]
    .filter(Boolean)
    .join('\n');

  return { system, messages: [{ role: 'user', content: `Build the exam pack.\n${details}` }] };
}
