import { Check, X } from 'lucide-react';
import { cn } from '../utils/cn.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * One MCQ. While `revealed` is false the correct answer is never shown,
 * and it is never marked in the DOM either.
 */
export default function QuestionCard({ question, index, total, selected, onSelect, revealed }) {
  return (
    <article className="card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3 text-[14px] text-muted">
        <span className="font-semibold">
          Question {index + 1} of {total}
        </span>
        <span className="flex gap-2">
          {question.difficulty && <span className="chip py-0.5">{question.difficulty}</span>}
          {question.topic && <span className="chip py-0.5">{question.topic}</span>}
        </span>
      </div>

      <h3 className="mt-4 font-display text-[22px] leading-snug sm:text-2xl">{question.question}</h3>

      <ul className="mt-5 space-y-2.5">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrect = revealed && optionIndex === question.correctIndex;
          const isWrongChoice = revealed && isSelected && optionIndex !== question.correctIndex;

          return (
            <li key={optionIndex}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => onSelect(optionIndex)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[16px] transition-colors',
                  !revealed && isSelected && 'border-pen bg-pen-soft',
                  !revealed && !isSelected && 'hover:border-pen',
                  isCorrect && 'border-mint bg-mint-tint',
                  isWrongChoice && 'border-coral bg-coral-tint',
                  revealed && 'cursor-default'
                )}
              >
                <span
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[13px] font-semibold',
                    isSelected && !revealed && 'border-pen text-pen',
                    isCorrect && 'border-mint bg-mint text-white',
                    isWrongChoice && 'border-coral bg-coral text-white'
                  )}
                >
                  {isCorrect ? <Check size={14} /> : isWrongChoice ? <X size={14} /> : LETTERS[optionIndex]}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {revealed && (
        <div className="card-quiet mt-5 p-4">
          <p className="text-[14px] font-semibold text-muted">Why</p>
          <p className="mt-1 text-[16px]">{question.explanation}</p>
        </div>
      )}
    </article>
  );
}
