import { cn } from '../utils/cn.js';

/** A single flashcard. Click, Enter or Space flips it. */
export default function FlashcardView({ card, flipped, onFlip }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={flipped ? 'Show the question' : 'Show the answer'}
      onClick={onFlip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onFlip();
        }
      }}
      className="group w-full cursor-pointer [perspective:1400px]"
    >
      <div
        className={cn(
          'relative h-[300px] w-full transition-transform duration-500 [transform-style:preserve-3d] sm:h-[320px]',
          flipped && '[transform:rotateY(180deg)]'
        )}
      >
        <Face className="card">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">Question</p>
          <p className="mt-4 max-w-xl font-display text-2xl leading-snug sm:text-[28px]">{card.front}</p>
          <p className="mt-auto text-[14px] text-muted">Click to see the answer</p>
        </Face>

        <Face className="card [transform:rotateY(180deg)]" style={{ backgroundColor: 'var(--raised)' }}>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">Answer</p>
          <p className="mt-4 max-w-xl text-[19px] leading-relaxed">{card.back}</p>
          {card.topic && <p className="mt-auto text-[14px] text-muted">{card.topic}</p>}
        </Face>
      </div>
    </div>
  );
}

function Face({ children, className, style }) {
  return (
    <div
      style={style}
      className={cn(
        'absolute inset-0 flex flex-col items-start justify-start p-7 [backface-visibility:hidden] sm:p-9',
        className
      )}
    >
      {children}
    </div>
  );
}
