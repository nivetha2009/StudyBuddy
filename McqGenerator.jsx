import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListChecks, Play, Download } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import MaterialPicker from '../components/MaterialPicker.jsx';
import OptionChips from '../components/OptionChips.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ResultsPanel from '../components/ResultsPanel.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorNote from '../components/ErrorNote.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useStudy } from '../context/StudyContext.jsx';
import { downloadText, safeFileName } from '../utils/download.js';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'HOTS'];
const TYPES = ['Conceptual', 'Application-based', 'Logical', 'Case-based', 'Assertion & Reason'];
const COUNTS = [5, 10, 15, 20];

export default function McqGenerator() {
  const { activeMaterial, activeMaterialId, recordQuiz } = useStudy();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [type, setType] = useState('Conceptual');

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!activeMaterialId && !topic.trim()) {
      setError('Choose an uploaded material or type a topic first.');
      return;
    }

    setError('');
    setBusy(true);
    setQuestions([]);
    setAnswers({});
    setRevealed({});
    setSubmitted(false);

    try {
      const data = await api.mcqs({
        materialId: activeMaterialId || undefined,
        topic: topic.trim() || undefined,
        count,
        difficulty,
        type
      });
      setQuestions(data.questions);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const submitAll = () => {
    setRevealed(Object.fromEntries(questions.map((_, index) => [index, true])));
    setSubmitted(true);

    const topics = {};
    questions.forEach((question, index) => {
      const key = question.topic || 'General';
      topics[key] = topics[key] || { correct: 0, total: 0 };
      topics[key].total += 1;
      if (answers[index] === question.correctIndex) topics[key].correct += 1;
    });

    const correct = questions.filter((question, index) => answers[index] === question.correctIndex).length;

    recordQuiz({
      id: `mcq-${Date.now()}`,
      title: activeMaterial?.name || topic || 'MCQ practice',
      score: correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      seconds: null,
      topics
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendToQuiz = () => {
    navigate('/quiz', { state: { questions, title: activeMaterial?.name || topic || 'Practice quiz' } });
  };

  const exportQuestions = () => {
    const lines = questions.map((question, index) => {
      const options = question.options
        .map((option, optionIndex) => `   ${String.fromCharCode(65 + optionIndex)}. ${option}`)
        .join('\n');
      return `${index + 1}. ${question.question}\n${options}\n   Answer: ${String.fromCharCode(
        65 + question.correctIndex
      )}\n   Why: ${question.explanation}\n`;
    });
    downloadText(safeFileName(`${activeMaterial?.name || topic || 'studybuddy'}-mcqs`, 'txt'), lines.join('\n'), 'text/plain');
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <PageHeader title="MCQ generator" subtitle="Build a practice set, answer it, and see the explanation for every question." />

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-5">
          <MaterialPicker />

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Topic (optional)</span>
            <input
              className="field"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Thermodynamics, Unit 2"
            />
          </label>

          <OptionChips label="Number of questions" options={COUNTS.map(String)} value={String(count)} onChange={(value) => setCount(Number(value))} />
          <OptionChips label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
          <OptionChips label="Question type" options={TYPES} value={type} onChange={setType} />

          <button onClick={generate} className="btn btn-primary w-full" disabled={busy}>
            <ListChecks size={16} /> Generate questions
          </button>

          {questions.length > 0 && (
            <div className="space-y-2">
              <button onClick={sendToQuiz} className="btn btn-secondary w-full">
                <Play size={15} /> Practise in timed quiz mode
              </button>
              <button onClick={exportQuestions} className="btn btn-ghost w-full">
                <Download size={15} /> Download question set
              </button>
            </div>
          )}
        </aside>

        <section className="space-y-5">
          {error && <ErrorNote message={error} onRetry={generate} />}

          {busy && (
            <div className="card p-6">
              <Spinner label={`Writing ${count} ${difficulty} questions`} />
            </div>
          )}

          {!busy && !questions.length && !error && (
            <EmptyState
              icon={ListChecks}
              title="No questions yet"
              body="Pick a difficulty and question type on the left. HOTS and case-based questions are the closest to what universities actually ask."
            />
          )}

          {submitted && questions.length > 0 && (
            <ResultsPanel
              questions={questions}
              answers={answers}
              onRestart={() => {
                setAnswers({});
                setRevealed({});
                setSubmitted(false);
              }}
              title="Practice result"
            />
          )}

          {questions.map((question, index) => (
            <QuestionCard
              key={question.id || index}
              question={question}
              index={index}
              total={questions.length}
              selected={answers[index]}
              revealed={Boolean(revealed[index])}
              onSelect={(optionIndex) => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
            />
          ))}

          {questions.length > 0 && !submitted && (
            <div className="card sticky bottom-4 flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="text-[15px] text-muted">
                {answeredCount} of {questions.length} answered
              </p>
              <button onClick={submitAll} className="btn btn-primary" disabled={!answeredCount}>
                Submit and check answers
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
