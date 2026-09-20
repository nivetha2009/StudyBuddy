import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext.jsx';

/** Tells students that answers are samples while no AI key is configured. */
export default function DemoBanner() {
  const { aiStatus } = useStudy();
  const [hidden, setHidden] = useState(false);

  if (hidden || !aiStatus?.demoMode) return null;

  return (
    <div className="border-b" style={{ backgroundColor: 'var(--highlight)' }}>
      <div className="container-page flex items-center gap-3 py-2 text-[14px] text-[#14142b]">
        <Sparkles size={16} className="shrink-0" />
        <p className="flex-1">
          Demo mode. Answers below are sample content, not live AI output. Add an API key in <code className="font-mono">server/.env</code> to
          switch on real answers.
        </p>
        <button onClick={() => setHidden(true)} aria-label="Hide demo notice" className="shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
