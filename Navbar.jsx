import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { cn } from '../utils/cn.js';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/tutor', label: 'AI Tutor' },
  { to: '/materials', label: 'Study Materials' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/exam-prep', label: 'Exam Prep' },
  { to: '/dashboard', label: 'Dashboard' }
];

const EXTRA_LINKS = [
  { to: '/notes', label: 'Smart Notes' },
  { to: '/mcqs', label: 'MCQ Generator' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ backgroundColor: 'var(--paper)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-pill px-3 py-2 text-[15px] font-semibold transition-colors',
                  isActive ? 'bg-pen-soft text-pen' : 'text-muted hover:text-ink'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Log in
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-9 w-9 place-items-center rounded-pill border lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-surface lg:hidden">
          <nav className="container-page grid gap-1 py-3" aria-label="Mobile">
            {[...LINKS, ...EXTRA_LINKS].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2.5 text-[16px] font-semibold',
                    isActive ? 'bg-pen-soft text-pen' : 'text-muted'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/login" className="btn btn-primary mt-2 sm:hidden">
              Log in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
