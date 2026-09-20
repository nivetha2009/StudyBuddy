import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Timer, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import MaterialPicker from '../components/MaterialPicker.jsx';
import OptionChips from '../components/OptionChips.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ResultsPanel from '../components/ResultsPanel.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorNote from '../components/ErrorNote.jsx';
import { api } from '../services/api.js';
import { useStudy } from '../context/StudyContext.jsx';
import { formatSeconds } from '../utils/format.js';

const COUNTS = [5, 10, 15, 20];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'HOTS'];
const LIMITS = [
  { value: '0', label: 'No timer' },
  { value: '300', label: '5 min' },
  { value: '600', label: '10 min' },
  { value: '1200', label: '20 min' }
];

export default function Quiz() {
  const location = useLocation();
  const { activeMaterial, activeMaterialId, recordQuiz } = useStudy();

  const [stage, setStage] = useState('setup'); // setup | running | done
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('Practice quiz');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [limit, setLimit] = useState('600');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const timerRef = useRef(null);

  const finish = useCallback(
    (finalAnswers, elapsed) => {
      clearInterval(timerRef.current);
      setStage('done');

      const topics = {};
      questions.forEach((question, index) => {
        const key = question.topic || 'General';
        topics[key] = topics[key] || { correct: 0, total: 0 };
        topics[key].total += 1;
        if (finalAnswers[index] === question.correctIndex) topics[key].correct += 1;
      });

      const correct = questions.filter((question, index) => finalAnswers[index] === question.correctIndex).length;

      recordQuiz({
        id: `quiz-${Date.now()}`,
        title,
        score: correct,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
        seconds: elapsed,
        topics
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [questions, recordQuiz, title]
  );

  // Questions handed over from the MCQ generator start a quiz immediately.
  useEffect(() => {
    const incoming = location.state?.questions;
    if (incoming?.length) {
      setQuestions(incoming);
      setTitle(location.state.title || 'Practice quiz');
      setStage('running');
      setAnswers({});
      setCurrent(0);
      setSeconds(0);
    }
  }, [location.state]);

  useEffect(() => {
    if (stage !== 'running') return undefined;

    timerRef.current = setInterval(() => {
      setSeconds((value) => {
        const next = value + 1;
        const cap = Number(limit);
        if (cap && next >= cap) {
          clearInterval(timerRef.current);
          setAnswers((currentAnswers) => {
            finish(currentAnswers, next);
            return currentAnswers;
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [stage, limit, finish]);

  const start = async () => {
    if (!activeMaterialId && !topic.trim()) {
      setError('Choose an uploaded material or type a topic to build a quiz from.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const data = await api.mcqs({
        materialId: activeMaterialId || undefined,
        topic: topic.trim() || undefined,
        count,
        difficulty,
        type: 'Conceptual'
      });
      setQuestions(data.questions);
      setTitle(activeMaterial?.name || topic || 'Practice quiz');
      setAnswers({});
      setCurrent(0);
      setSeconds(0);
      setStage('running');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setStage('setup');
    setQuestions([]);
    setAnswers({});
    setSeconds(0);
    setCurrent(0);
  };

  const cap = Number(limit);
  const remaining = cap ? Math.max(0, cap - seconds) : null;
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <PageHeader
        title="Quiz mode"
        subtitle="One question at a time, answers hidden until you submit, and a breakdown of what to revise at the end."
      />

      <div className="container-page py-8">
        {stage === 'setup' && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="card space-y-5 p-6 sm:p-8">
              <MaterialPicker />

              <label className="block">
                <span className="mb-2 block text-[14px] font-semibold text-muted">Topic (optional)</span>
                <input
                  className="field"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="e.g. Photosynthesis"
                />
              </label>

              <OptionChips
                label="Questions"
                options={COUNTS.map(String)}
                value={String(count)}
                onChange={(value) => setCount(Number(value))}
              />
              <OptionChips label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
              <OptionChips label="Time limit" options={LIMITS} value={limit} onChange={setLimit} />

              <button onClick={start} className="btn btn-primary w-full" disabled={busy}>
                <Timer size={16} /> Start quiz
              </button>
            </div>

            {busy && (
              <div className="card p-6">
                <Spinner label="Setting up your quiz" />
              </div>
            )}
            {error && <ErrorNote message={error} onRetry={start} />}
          </div>
        )}

        {stage === 'running' && questions.length > 0 && (
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="card flex flex-wrap items-center justify-between gap-4 p-4">
              <p className="font-display text-lg">{title}</p>
              <div className="flex items-center gap-4 text-[15px]">
                <span className="text-muted">
                  {answeredCount}/{questions.length} answered
                </span>
                <span className="chip chip-active">
                  <Timer size={14} /> {remaining !== null ? formatSeconds(remaining) : formatSeconds(seconds)}
                </span>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-pill" style={{ backgroundColor: 'var(--raised)' }}>
              <div
                className="h-full rounded-pill bg-pen transition-[width] duration-300"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>

            <QuestionCard
              question={questions[current]}
              index={current}
              total={questions.length}
              selected={answers[current]}
              revealed={false}
              onSelect={(optionIndex) => setAnswers((value) => ({ ...value, [current]: optionIndex }))}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                className="btn btn-secondary"
                disabled={current === 0}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent((value) => value + 1)} className="btn btn-primary">
                  Next question <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={() => finish(answers, seconds)} className="btn btn-primary">
                  <Flag size={16} /> Submit quiz
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id || index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to question ${index + 1}`}
                  className={`h-8 w-8 rounded-lg border text-[14px] font-semibold ${
                    index === current
                      ? 'border-pen text-pen'
                      : answers[index] !== undefined
                        ? 'bg-pen-soft text-pen'
                        : 'text-muted'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div className="mx-auto max-w-3xl space-y-6">
            <ResultsPanel questions={questions} answers={answers} seconds={seconds} onRestart={restart} title={title} />

            <details className="card p-6">
              <summary className="cursor-pointer font-display text-xl">Review every question</summary>
              <div className="mt-5 space-y-5">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id || index}
                    question={question}
                    index={index}
                    total={questions.length}
                    selected={answers[index]}
                    revealed
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </>
  );
}
