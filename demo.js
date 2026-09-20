/**
 * Demo provider.
 *
 * Returns realistic, clearly-labelled sample content so the whole product can be
 * explored before an AI API key is configured. It never calls the network.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DEMO_BANNER = '> **Sample response.** StudyBuddy is running in demo mode, so this content is illustrative rather than generated from an AI model. Add an API key in `server/.env` to switch on real answers.';

function subjectOf(input = '') {
  const cleaned = String(input).replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'this topic';
  const firstSentence = cleaned.split(/[.?!\n]/)[0];
  return firstSentence.length > 70 ? `${firstSentence.slice(0, 67)}...` : firstSentence;
}

function demoChat({ prompt, mode }) {
  const topic = subjectOf(prompt);

  const bodies = {
    simple: `## ${topic}, in plain words

Think of it like turning the tap in your kitchen. Turn it a little and a little water comes out; turn it a lot and much more comes out. The relationship between how much you turn and how much comes out is exactly the kind of relationship this idea describes.

**The core idea**
- One thing changes, and something else responds.
- We care about *how strongly* it responds, not just that it does.
- The strength of that response is what we measure and compare.

**Why it matters for your exam**
Most questions on this topic are really asking: *if this input changes, what happens to the output, and by how much?* If you can answer that in one sentence, you can usually pick up the first two marks.`,

    detailed: `## ${topic}

### Definition
A clear, exam-ready definition goes here, stated in one sentence so it can be reproduced under time pressure.

### How it works
1. **Set up** — identify the variables involved and which one you control.
2. **Relate** — write the relationship between them, usually as a ratio or a formula.
3. **Interpret** — a number on its own scores nothing; say what it means in context.

### Where students lose marks
- Writing the formula but never defining the symbols.
- Giving the value without the unit.
- Confusing the cause with the effect when the question reverses them.

### Quick check
If you doubled the input, what would happen to the output? If you can answer that without the formula, you understand it.`,

    example: `### Worked example

**Question.** A shop sells 200 notebooks a week at Rs 50 each. The price rises to Rs 55 and weekly sales fall to 180.

**Step 1 — write down what changed.**
Price: 50 to 55. Quantity: 200 to 180.

**Step 2 — turn each change into a percentage.**
Price change = (55 - 50) / 50 = +10%.
Quantity change = (180 - 200) / 200 = -10%.

**Step 3 — combine them.**
Response = -10% / 10% = -1. The size of the response is 1.

**Step 4 — say what it means.**
The response is exactly proportional: the quantity falls by the same percentage the price rises, so total revenue is unchanged.

**The idea behind it:** compare *percentage* changes, never the raw numbers.`,

    exam: `### Model answer (10 marks)

**Definition (2 marks)**
State the concept in one precise sentence, with the formula written underneath and every symbol defined.

**Explanation (4 marks)**
1. **Meaning of the measure** — what a high value and a low value each tell you.
2. **Factors that affect it** — list four, with one line of justification each.
3. **Diagram** — draw the standard curve, label both axes, and mark the point being discussed.

**Application (3 marks)**
Apply it to one real situation and state the decision it supports.

**Conclusion (1 mark)**
One sentence linking the result back to the question asked.

*What the examiner is looking for:* the defined formula, a labelled diagram, and at least one applied example.`,

    summary: `**${topic} in eight points**

- The concept measures how strongly one variable responds to another.
- It is always a ratio of percentage changes, never of raw values.
- A value above 1 means a strong response; below 1 means a weak one.
- The sign tells you direction; the size tells you strength.
- Time matters: responses are usually larger over a longer period.
- Substitutes make responses stronger; necessities make them weaker.
- Always state the unit or say explicitly that the measure has none.
- Interpretation earns more marks than calculation.`,

    quizme: `Let's test what you know. Answer them one at a time and I'll check each answer.

1. In your own words, what does this concept actually measure?
2. Write down the formula and say what each symbol stands for.
3. If the input rose by 20% and the output fell by 5%, what value would you get, and what does it tell you?
4. Give one real situation from your own life where this idea explains what happens, and justify it in two sentences.`
  };

  return `${DEMO_BANNER}\n\nSource: general knowledge\n\n${bodies[mode] || bodies.simple}`;
}

function demoNotes({ prompt, style }) {
  const topic = subjectOf(prompt);
  const depth = style === 'quick' ? 'Quick revision' : style === 'exam' ? 'Exam' : style === 'beginner' ? 'Beginner' : 'Detailed';

  return `${DEMO_BANNER}

# ${topic} — ${depth} notes

## Overview
This topic explains how one quantity responds when another one changes, and how that response is measured, interpreted and applied.

## Key concepts
### The core relationship
- Two variables, one of which influences the other.
- The influence is measured as a ratio of percentage changes.
- Direction and size are read separately.

### Reading the value
- Greater than 1: a strong response.
- Equal to 1: a proportional response.
- Less than 1: a weak response.

## Definitions
- **Response measure** — the ratio of the percentage change in the output to the percentage change in the input.
- **Proportional response** — a change of the same percentage in both variables.
- **Determinant** — any factor that makes the response stronger or weaker.

## Worked examples
1. Input rises 10%, output falls 20% -> value of 2, a strong response.
2. Input rises 10%, output falls 10% -> value of 1, proportional.
3. Input rises 10%, output falls 4% -> value of 0.4, a weak response.

## Important points to remember
- Always use percentage changes, never absolute differences.
- Quote the value *and* what it means; the interpretation carries the marks.
- Responses grow over longer time periods because people find alternatives.

## Key terms
Response measure, determinant, proportional change, threshold, substitute, time horizon.

## Possible exam questions
1. Define the concept and state its formula. (2 marks)
2. Explain four factors that determine the strength of the response. (5 marks)
3. Using a diagram, explain how the measure changes along the curve, and apply it to a pricing decision. (10 marks)`;
}

function demoSummary({ prompt }) {
  const topic = subjectOf(prompt);
  return `${DEMO_BANNER}

Source: general knowledge

**${topic}** describes how strongly one variable responds when another changes, measured as a ratio of percentage changes.

## Main ideas
- The measure compares percentage changes, not raw amounts.
- The sign shows direction, the size shows strength.
- Values above 1 mean the response outweighs the cause.
- Substitutes, necessity and time all shift the result.
- The interpretation matters more than the arithmetic.
- The same method applies across subjects wherever a cause and an effect can be measured.

## In one line
Divide the percentage change in the effect by the percentage change in the cause, then say what the number means.`;
}

function demoMcq({ count = 5, difficulty = 'Medium', type = 'Conceptual', topic }) {
  const label = topic ? subjectOf(topic) : 'Sample topic';
  const bank = [
    {
      question: `[Sample question] Which statement best describes ${label}?`,
      options: [
        'A ratio of percentage changes between two related variables',
        'The difference between two absolute values',
        'The average of all observed values',
        'The total of the inputs over a fixed period'
      ],
      correctIndex: 0,
      explanation: 'It is always defined as percentage change in the effect divided by percentage change in the cause. Totals and averages describe size, not responsiveness.',
      topic: 'Definitions'
    },
    {
      question: '[Sample question] The input rises by 20% and the output falls by 10%. What is the size of the response?',
      options: ['2.0', '0.5', '10', '0.2'],
      correctIndex: 1,
      explanation: '10 divided by 20 gives 0.5, a weak response. Picking 2.0 means the fraction was inverted, which is the most common slip.',
      topic: 'Calculation'
    },
    {
      question: '[Sample question] Which factor makes a response stronger?',
      options: [
        'The item is a daily necessity',
        'Close substitutes are easily available',
        'The change is measured over a single day',
        'The item takes a very small share of income'
      ],
      correctIndex: 1,
      explanation: 'Available substitutes let people switch away, so the response is larger. Necessities, short time periods and small budget shares all weaken it.',
      topic: 'Determinants'
    },
    {
      question: '[Sample question] A value of exactly 1 means that',
      options: [
        'there is no response at all',
        'the response is proportional to the change',
        'the response is infinite',
        'the two variables are unrelated'
      ],
      correctIndex: 1,
      explanation: 'A value of 1 means both variables change by the same percentage. No response is 0; an unrelated pair would also give 0.',
      topic: 'Interpretation'
    },
    {
      question: '[Sample question] Over a longer time period, responses usually',
      options: ['become weaker', 'stay exactly the same', 'become stronger', 'become impossible to measure'],
      correctIndex: 2,
      explanation: 'Given time, people find alternatives and adjust habits, so the measured response grows.',
      topic: 'Time horizon'
    },
    {
      question: '[Sample question] A shopkeeper raises a price and total revenue stays the same. The response was',
      options: ['weak', 'proportional', 'strong', 'negative'],
      correctIndex: 1,
      explanation: 'Unchanged revenue is the signature of a proportional response, where the two percentage changes cancel out.',
      topic: 'Application'
    },
    {
      question: '[Sample question] Which of these is the most common error in an exam answer on this topic?',
      options: [
        'Using percentage changes',
        'Defining the symbols in the formula',
        'Stating the value without interpreting it',
        'Drawing a labelled diagram'
      ],
      correctIndex: 2,
      explanation: 'Marks are awarded for the interpretation. A bare number, however accurate, usually scores only half.',
      topic: 'Exam technique'
    },
    {
      question: '[Sample question] Assertion (A): the response is larger over a year than over a week. Reason (R): people need time to find alternatives.',
      options: [
        'Both A and R are true and R explains A',
        'Both A and R are true but R does not explain A',
        'A is true, R is false',
        'A is false, R is true'
      ],
      correctIndex: 0,
      explanation: 'Both statements are true, and the need for time to adjust is exactly why longer periods show larger responses.',
      topic: 'Assertion & Reason'
    }
  ];

  const questions = Array.from({ length: Math.min(count, 20) }, (_, index) => {
    const source = bank[index % bank.length];
    return { ...source, id: `demo-q${index + 1}`, difficulty, type };
  });

  return { questions };
}

function demoFlashcards({ count = 10, topic }) {
  const label = topic ? subjectOf(topic) : 'Sample topic';
  const bank = [
    ['What does this measure compare?', 'Percentage change in the effect against percentage change in the cause. Never raw amounts.', 'Definitions'],
    ['What does a value greater than 1 mean?', 'The effect moves more than the cause: a strong response.', 'Interpretation'],
    ['What does a value of 1 mean?', 'Both change by the same percentage, so totals stay unchanged.', 'Interpretation'],
    ['Name three factors that strengthen a response.', 'Close substitutes, a large share of the budget, and a longer time period.', 'Determinants'],
    ['Why does time increase the response?', 'People need time to find alternatives and change habits.', 'Determinants'],
    ['What is the formula?', 'Percentage change in output divided by percentage change in input.', 'Formulas'],
    ['Input +25%, output -5%. Value?', '0.2, a weak response. Divide 5 by 25.', 'Calculation'],
    ['What does the sign tell you?', 'Direction only. A negative sign means the two move in opposite directions.', 'Interpretation'],
    ['Most common exam mistake?', 'Inverting the fraction. Effect goes on top, cause on the bottom.', 'Exam technique'],
    ['How do you earn the final mark?', 'Interpret the number in the context of the question in one sentence.', 'Exam technique'],
    [`Give one real use of ${label}.`, 'Deciding whether raising a price will raise or lower total revenue.', 'Application'],
    ['Does this measure have a unit?', 'No. It is a ratio of two percentages, so the units cancel.', 'Definitions']
  ];

  const cards = Array.from({ length: Math.min(count, 30) }, (_, index) => {
    const [front, back, cardTopic] = bank[index % bank.length];
    return { id: `demo-c${index + 1}`, front: `[Sample] ${front}`, back, topic: cardTopic };
  });

  return { cards };
}

function demoExam({ subject = 'Your subject', topics = '' }) {
  return `${DEMO_BANNER}

# ${subject} — Exam pack

## Study plan
- **Day 1** — read the syllabus and mark every topic you cannot explain out loud.
- **Day 2-3** — cover the weak topics first, one set of notes per topic.
- **Day 4** — practise 2-mark and 5-mark questions against the clock.
- **Day 5** — full 10-mark answers with diagrams.
- **Day 6** — one timed mock paper.
- **Day 7** — flashcards, formulas and the revision checklist only.

## 2-mark questions
1. Define the core concept and state its formula. [3 lines]
2. State two factors that affect it. [3 lines]
3. What does a value of exactly 1 indicate? [2 lines]

## 5-mark questions
1. Explain four determinants with one example each. [5 points]
2. Distinguish between a strong and a weak response with a diagram. [5 points]
3. Explain how the measure changes across different situations. [5 points]

## 10-mark questions
1. Explain the concept fully, derive the formula, illustrate it with a labelled diagram and apply it to one decision. [headings + diagram]
2. Critically evaluate how useful the measure is in practice, with two real examples. [headings + evaluation]

## Important definitions
- **Response measure** — the ratio of percentage changes between two linked variables.
- **Determinant** — a factor that strengthens or weakens that response.
- **Proportional case** — both variables change by the same percentage.

## Important concepts
- Percentage thinking, not absolute thinking.
- Direction versus strength.
- Short run against long run.

## Application questions
1. A seller raises a price by 8% and sales fall by 12%. Advise the seller. ${topics ? `(Link to: ${topics})` : ''}
2. Two products respond very differently to the same change. Explain why.

## HOTS questions
1. Two students calculate different values from the same data. Explain how both could be defensible.
2. Design a small experiment to measure this response in your own college canteen, and state its limitations.

## Revision checklist
- [ ] I can state the definition from memory
- [ ] I can write and explain the formula
- [ ] I can calculate a value in under a minute
- [ ] I can draw and label the diagram
- [ ] I can list four determinants with examples
- [ ] I can interpret any value in one sentence
- [ ] I have attempted one full 10-mark answer under time`;
}

export const demoProvider = {
  name: 'demo',

  async generate({ task, prompt, mode, style, count, difficulty, type, topic, subject, topics }) {
    await delay(500 + Math.random() * 600); // keeps loading states honest

    switch (task) {
      case 'notes':
        return { text: demoNotes({ prompt: topic || prompt, style }), demo: true };
      case 'summary':
        return { text: demoSummary({ prompt: topic || prompt }), demo: true };
      case 'mcq':
        return { json: demoMcq({ count, difficulty, type, topic: topic || prompt }), demo: true };
      case 'flashcards':
        return { json: demoFlashcards({ count, topic: topic || prompt }), demo: true };
      case 'exam':
        return { text: demoExam({ subject, topics }), demo: true };
      case 'chat':
      default:
        return { text: demoChat({ prompt, mode }), demo: true };
    }
  }
};
