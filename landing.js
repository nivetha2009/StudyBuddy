/**
 * Landing page copy kept out of the components so it is easy to edit.
 * Reviews are sample content written for this demo, not real students.
 */

export const FEATURES = [
  {
    to: '/tutor',
    icon: 'MessageSquare',
    title: 'AI Tutor',
    body: 'Ask anything and pick how you want it explained: simply, in detail, or as a model exam answer.'
  },
  {
    to: '/materials',
    icon: 'FileSearch',
    title: 'PDF analyzer',
    body: 'Upload a PDF, slide deck or Word file and StudyBuddy reads it so your answers come from your syllabus.'
  },
  {
    to: '/notes',
    icon: 'NotebookPen',
    title: 'Smart notes',
    body: 'Turn 40 pages into structured notes with definitions, examples and likely exam questions.'
  },
  {
    to: '/mcqs',
    icon: 'ListChecks',
    title: 'MCQ generator',
    body: 'Choose the count, difficulty and question type, from plain recall up to HOTS and case-based.'
  },
  {
    to: '/flashcards',
    icon: 'Layers',
    title: 'Flashcards',
    body: 'Flip through terms and formulas, mark what is easy, and keep only the difficult ones in rotation.'
  },
  {
    to: '/quiz',
    icon: 'Timer',
    title: 'Quiz mode',
    body: 'Timed practice with a progress bar, one question at a time, and answers hidden until you submit.'
  },
  {
    to: '/exam-prep',
    icon: 'GraduationCap',
    title: 'Exam prep',
    body: 'Enter your subject, module and exam date to get 2, 5 and 10-mark questions plus a day-by-day plan.'
  },
  {
    to: '/dashboard',
    icon: 'TrendingUp',
    title: 'Progress tracker',
    body: 'Scores, streaks and the topics you keep getting wrong, so revision starts where it matters.'
  }
];

export const STEPS = [
  {
    title: 'Upload what you already study',
    body: 'Lecture slides, a scanned-to-text PDF, a shared Word file or your own typed notes.'
  },
  {
    title: 'Pick a tool',
    body: 'Notes, MCQs, flashcards, a quiz or an exam pack. Every tool reads the same uploaded material.'
  },
  {
    title: 'Practise until it sticks',
    body: 'Answer, check the explanation, and let the dashboard point you at the topics you keep missing.'
  }
];

export const REASONS = [
  {
    title: 'Answers stay inside your syllabus',
    body: 'When a material is selected, StudyBuddy answers from it first and says clearly when something is not in there.'
  },
  {
    title: 'Written for students, not for researchers',
    body: 'Plain sentences, defined terms and worked examples instead of textbook paragraphs you have to decode twice.'
  },
  {
    title: 'Practice that matches your paper',
    body: 'Tell it your marks pattern and get answers sized to 2, 5 and 10 marks, with the points an examiner looks for.'
  },
  {
    title: 'You can see what is weak',
    body: 'Every quiz is broken down by topic, so you revise the three things that are failing, not all thirty.'
  }
];

export const TESTIMONIALS = [
  {
    quote:
      'I uploaded four lecture decks the night before my internals and had a revision sheet and forty practice questions in about ten minutes.',
    name: 'Ananya R.',
    detail: 'Sample review — second-year BBA'
  },
  {
    quote:
      'The part I use most is the exam answer mode. It shows the structure a 10-mark answer needs, which nobody actually teaches you.',
    name: 'Karthik M.',
    detail: 'Sample review — final-year engineering'
  },
  {
    quote:
      'Flashcards on my phone between classes, quiz mode at home. The weak topics list told me my problem was one chapter, not the whole subject.',
    name: 'Fatima S.',
    detail: 'Sample review — class 12'
  }
];

export const FAQS = [
  {
    question: 'Do I need an AI API key to try it?',
    answer:
      'No. StudyBuddy ships in demo mode, which returns realistic sample content so you can see every screen. Add a key in the server environment file to switch on real AI answers.'
  },
  {
    question: 'Which files can I upload?',
    answer: 'PDF, PPTX, DOCX, TXT and MD, up to 15 MB. Scanned images inside a PDF cannot be read yet, because there is no OCR step.'
  },
  {
    question: 'Will it answer only from my material?',
    answer:
      'When you select an uploaded material it is treated as the primary source. If something is not covered there, the answer says so before falling back to general knowledge.'
  },
  {
    question: 'Is my uploaded material stored permanently?',
    answer:
      'No. Materials are held in the server for the current session and cleared on restart. Your progress and flashcard marks are stored only in your own browser.'
  },
  {
    question: 'Can I use it for university exam patterns?',
    answer:
      'Yes. Exam prep has a field for your university or college pattern, and the generated questions follow the marks split you describe.'
  },
  {
    question: 'Is it free?',
    answer: 'This project is open source and free to run yourself. If you connect a paid AI provider, that provider charges for usage.'
  }
];
