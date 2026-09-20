import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { MessageSquare, ListChecks, Target, FileText, Layers, Flame, Pencil } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { greeting, formatDate, formatSeconds } from '../utils/format.js';

export default function Dashboard() {
  const { progress, materials, streak, averageScore, weakTopics, setStudentName, resetProgress } = useStudy();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(progress.studentName);

  const scoreSeries = useMemo(
    () =>
      [...progress.quizzes]
        .slice(0, 10)
        .reverse()
        .map((quiz, index) => ({
          name: `#${index + 1}`,
          score: quiz.percentage,
          label: quiz.title
        })),
    [progress.quizzes]
  );

  const topicSeries = useMemo(() => {
    const totals = {};
    progress.quizzes.forEach((quiz) => {
      Object.entries(quiz.topics || {}).forEach(([topic, stat]) => {
        totals[topic] = totals[topic] || { correct: 0, total: 0 };
        totals[topic].correct += stat.correct;
        totals[topic].total += stat.total;
      });
    });
    return Object.entries(totals)
      .map(([topic, stat]) => ({
        topic: topic.length > 16 ? `${topic.slice(0, 15)}…` : topic,
        accuracy: Math.round((stat.correct / stat.total) * 100)
      }))
      .slice(0, 8);
  }, [progress.quizzes]);

  const saveName = () => {
    setStudentName(nameDraft.trim());
    setEditingName(false);
  };

  return (
    <>
      <PageHeader
        title={
          editingName ? (
            <span className="inline-flex items-center gap-2">
              <input
                className="field max-w-[260px]"
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && saveName()}
                autoFocus
              />
              <button onClick={saveName} className="btn btn-primary btn-sm">
                Save
              </button>
            </span>
          ) : (
            <span className="inline-flex flex-wrap items-center gap-3">
              {greeting()}, {progress.studentName} 👋
              <button
                onClick={() => setEditingName(true)}
                className="btn btn-ghost btn-sm"
                aria-label="Change your name"
              >
                <Pencil size={14} /> Change name
              </button>
            </span>
          )
        }
        subtitle="Everything here is stored in your own browser, so it stays on this device."
      >
        <button onClick={resetProgress} className="btn btn-ghost btn-sm">
          Reset progress
        </button>
      </PageHeader>

      <div className="container-page space-y-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Questions asked" value={progress.questionsAsked} icon={MessageSquare} />
          <StatCard label="Quizzes completed" value={progress.quizzes.length} icon={ListChecks} />
          <StatCard
            label="Average score"
            value={progress.quizzes.length ? `${averageScore}%` : '—'}
            icon={Target}
            tone={averageScore >= 70 ? 'mint' : 'coral'}
          />
          <StatCard label="Study materials" value={materials.length} icon={FileText} />
          <StatCard label="Flashcards created" value={progress.flashcardsCreated} icon={Layers} />
        </div>

        <section className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl">Continue studying</h2>
              <p className="mt-1 text-[15px] text-muted">
                {materials.length
                  ? `Pick up ${materials[0].name} where you left it.`
                  : 'Upload your first chapter to get started.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={materials.length ? '/quiz' : '/materials'} className="btn btn-primary">
                {materials.length ? 'Take a quiz' : 'Upload material'}
              </Link>
              <Link to="/tutor" className="btn btn-secondary">
                Ask the tutor
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-6">
            <h2 className="font-display text-xl">Score across recent quizzes</h2>
            {scoreSeries.length ? (
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreSeries} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted)" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="var(--muted)" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: 12,
                        color: 'var(--ink)'
                      }}
                      formatter={(value) => [`${value}%`, 'Score']}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--pen)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="mt-4 text-[15px] text-muted">Finish a quiz and your scores will plot here.</p>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display text-xl">Accuracy by topic</h2>
            {topicSeries.length ? (
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicSeries} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="topic" stroke="var(--muted)" tickLine={false} axisLine={false} interval={0} angle={-18} dy={10} height={54} fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="var(--muted)" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: 12,
                        color: 'var(--ink)'
                      }}
                      formatter={(value) => [`${value}%`, 'Correct']}
                    />
                    <Bar dataKey="accuracy" fill="var(--pen)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="mt-4 text-[15px] text-muted">Topic accuracy appears once you have answered some questions.</p>
            )}
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="card p-6">
            <h2 className="font-display text-xl">Recent materials</h2>
            {materials.length ? (
              <ul className="mt-4 space-y-3">
                {materials.slice(0, 5).map((material) => (
                  <li key={material.id} className="flex items-start gap-3 border-t pt-3 first:border-0 first:pt-0">
                    <FileText size={16} className="mt-1 shrink-0 text-pen" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{material.name}</p>
                      <p className="text-[14px] text-muted">
                        {material.words.toLocaleString()} words · {formatDate(material.uploadedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[15px] text-muted">
                Nothing uploaded. <Link to="/materials" className="text-pen underline">Add a file</Link>.
              </p>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display text-xl">Recent quizzes</h2>
            {progress.quizzes.length ? (
              <ul className="mt-4 space-y-3">
                {progress.quizzes.slice(0, 5).map((quiz) => (
                  <li key={quiz.id} className="flex items-start justify-between gap-3 border-t pt-3 first:border-0 first:pt-0">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{quiz.title}</p>
                      <p className="text-[14px] text-muted">
                        {quiz.score}/{quiz.total}
                        {quiz.seconds ? ` · ${formatSeconds(quiz.seconds)}` : ''} · {formatDate(quiz.date)}
                      </p>
                    </div>
                    <span className={`chip ${quiz.percentage >= 70 ? 'text-mint' : 'text-coral'}`}>{quiz.percentage}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[15px] text-muted">No quizzes yet. Ten questions takes about five minutes.</p>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display text-xl">Study streak</h2>
            <p className="mt-4 flex items-baseline gap-2">
              <Flame size={22} className="text-coral" />
              <span className="font-display text-[44px] leading-none">{streak}</span>
              <span className="text-[16px] text-muted">day{streak === 1 ? '' : 's'} in a row</span>
            </p>
            <p className="mt-3 text-[15px] text-muted">
              {streak ? 'Anything counts: one question, one card, one quiz.' : 'Ask one question today to start a streak.'}
            </p>
          </section>
        </div>

        <section className="card p-6 sm:p-8">
          <h2 className="font-display text-xl">Weak topics and recommended revision</h2>
          {weakTopics.length ? (
            <ul className="mt-4 space-y-4">
              {weakTopics.map((topic) => (
                <li key={topic.topic} className="border-t pt-4 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{topic.topic}</p>
                    <span className="text-[15px] text-muted">
                      {topic.correct}/{topic.total} correct ({topic.accuracy}%)
                    </span>
                  </div>
                  <p className="mt-1.5 text-[15px] text-muted">
                    Generate beginner notes on this topic, then run ten HOTS questions on it.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Link to="/notes" className="chip text-muted hover:text-ink">
                      Notes
                    </Link>
                    <Link to="/flashcards" className="chip text-muted hover:text-ink">
                      Flashcards
                    </Link>
                    <Link to="/mcqs" className="chip text-muted hover:text-ink">
                      More questions
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : progress.quizzes.length ? (
            <p className="mt-4 text-[15px] text-muted">
              Nothing below 70% so far. Raise the difficulty to HOTS to find the real gaps.
            </p>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={Target}
                title="No weak topics yet"
                body="Take a quiz and StudyBuddy will point you at the topics worth re-reading."
                actionLabel="Take a quiz"
                actionTo="/quiz"
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
