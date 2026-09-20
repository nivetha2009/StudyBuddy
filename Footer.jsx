import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

const COLUMNS = [
  {
    title: 'Study tools',
    links: [
      { to: '/tutor', label: 'AI Tutor' },
      { to: '/notes', label: 'Smart Notes' },
      { to: '/mcqs', label: 'MCQ Generator' },
      { to: '/flashcards', label: 'Flashcards' }
    ]
  },
  {
    title: 'Practice',
    links: [
      { to: '/quiz', label: 'Quiz mode' },
      { to: '/exam-prep', label: 'Exam prep' },
      { to: '/materials', label: 'Upload material' },
      { to: '/dashboard', label: 'Progress' }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-surface" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-[15px] text-muted">
            Upload what you are already studying and turn it into explanations, notes, questions and practice you can
            finish before the exam.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="font-display text-base font-semibold">{column.title}</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-muted">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>StudyBuddy — a student project. Reviews on this site are sample content.</p>
          <p>Built with React, Vite and Express.</p>
        </div>
      </div>
    </footer>
  );
}
