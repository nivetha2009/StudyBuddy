import { Link } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import { formatSeconds, percentage } from '../utils/format.js';
import { cn } from '../utils/cn.js';

/** Shared results screen for MCQ practice and timed quizzes. */
export default function ResultsPanel({ questions, answers, seconds, onRestart, title = 'Your result' }) {
  const correct = questions.filter((question, index) => answers[index] === question.correctIndex).length;
  const incorrect = questions.length - correct;
  const score = percentage(correct, questions.length);

  const byTopic = {};
  questions.forEach((question, index) => {
    const topic = question.topic || 'General';
    byTopic[topic] = byTopic[topic] || { correct: 0, total: 0 };
    byTopic[topic].total += 1;
    if (answers[index] === question.correctIndex) byTopic[topic].correct += 1;
  });

  const topics = Object.entries(byTopic).map(([topic, stat]) => ({
    topic,
    ...stat,
    accuracy: Math.round((stat.correct / stat.total) * 100)
  }));

  const weak = topics.filter((topic) => topic.accuracy < 70);

  return (
    <section className="space-y-6">
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <h2 className="text-3xl">{title}</h2>
            <p className="mt-2 text-[17px] text-muted">
              {correct} of {questions.length} correct
              {typeof seconds === 'number' ? ` in ${formatSeconds(seconds)}` : ''}.
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[64px] leading-none">{score}</span>
            <span className="font-display text-2xl text-muted">%</span>
          </div>
        </div>

        <div className="grid border-t sm:grid-cols-3">
          <Metric label="Correct" value={correct} tone="mint" />
          <Metric label="Incorrect" value={incorrect} tone="coral" className="border-t sm:border-l sm:border-t-0" />
          <Metric
            label="Time taken"
            value={typeof seconds === 'number' ? formatSeconds(seconds) : '—'}
            className="border-t sm:border-l sm:border-t-0"
          />
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="font-display text-xl">Topic-wise performance</h3>
        <ul className="mt-4 space-y-3">
          {topics.map((topic) => (
            <li key={topic.topic}>
              <div className="flex items-center justify-between text-[15px]">
                <span className="font-semibold">{topic.topic}</span>
                <span className="text-muted">
                  {topic.correct}/{topic.total}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-pill" style={{ backgroundColor: 'var(--raised)' }}>
                <div
                  className={cn('h-full rounded-pill', topic.accuracy >= 70 ? 'bg-mint' : 'bg-coral')}
                  style={{ width: `${topic.accuracy}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="font-display text-xl">What to revise next</h3>
        {weak.length ? (
          <ul className="mt-3 space-y-2 text-[16px]">
            {weak.map((topic) => (
              <li key={topic.topic}>
                <span className="marker font-semibold">{topic.topic}</span> — {topic.accuracy}% correct. Re-read the
                notes for this topic, then retry these questions.
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[16px] text-muted">
            Nothing under 70%. Raise the difficulty to HOTS and see whether it still holds.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {onRestart && (
            <button onClick={onRestart} className="btn btn-primary">
              <RotateCw size={16} /> Try again
            </button>
          )}
          <Link to="/flashcards" className="btn btn-secondary">
            Revise with flashcards
          </Link>
          <Link to="/dashboard" className="btn btn-ghost">
            See progress
          </Link>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, tone, className = '' }) {
  const toneClass = { mint: 'text-mint', coral: 'text-coral' }[tone] || '';
  return (
    <div className={`p-6 ${className}`}>
      <p className="text-[14px] font-semibold text-muted">{label}</p>
      <p className={`mt-1 font-display text-3xl ${toneClass}`}>{value}</p>
    </div>
  );
}
