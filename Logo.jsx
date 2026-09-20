import { Link } from 'react-router-dom';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="StudyBuddy home">
      <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-pen text-white">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M4 5.5h7a3 3 0 0 1 3 3V19H7a3 3 0 0 1-3-3V5.5Z" fill="var(--highlight)" />
          <path d="M7 10h7M7 14h5" stroke="#14142b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16.5 4.5 20 8l-6.2 6.2-3.5-3.5L16.5 4.5Z" fill="#fff" opacity=".92" />
        </svg>
      </span>
      <span className="font-display text-[19px] font-extrabold tracking-tight">StudyBuddy</span>
    </Link>
  );
}
