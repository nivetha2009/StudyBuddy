import { useState } from 'react';
import { GraduationCap, Download, CalendarDays } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import MaterialPicker from '../components/MaterialPicker.jsx';
import Markdown from '../components/Markdown.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorNote from '../components/ErrorNote.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useStudy } from '../context/StudyContext.jsx';
import { downloadText, safeFileName } from '../utils/download.js';

const MARKS_PRESETS = [
  '2, 5 and 10 mark questions',
  'Section A (2 marks), Section B (7 marks), Section C (15 marks)',
  'MCQs plus short answers',
  'Long answers only'
];

export default function ExamPrep() {
  const { activeMaterialId, recordEvent } = useStudy();

  const [form, setForm] = useState({
    subject: '',
    module: '',
    topics: '',
    examDate: '',
    marksPattern: MARKS_PRESETS[0],
    pattern: ''
  });
  const [pack, setPack] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const generate = async (event) => {
    event.preventDefault();

    if (!form.subject.trim()) {
      setError('Enter the subject you are preparing for.');
      return;
    }

    setError('');
    setBusy(true);
    setPack('');

    try {
      const data = await api.examPack({ ...form, materialId: activeMaterialId || undefined });
      setPack(data.pack);
      recordEvent('notes');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const daysLeft = form.examDate
    ? Math.ceil((new Date(form.examDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      <PageHeader
        title="Exam prep"
        subtitle="Tell StudyBuddy what your paper looks like, and get questions sized to the marks they carry."
      />

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[380px,1fr]">
        <form onSubmit={generate} className="card h-fit space-y-5 p-6">
          <MaterialPicker />

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Subject</span>
            <input className="field" value={form.subject} onChange={update('subject')} placeholder="e.g. Managerial Economics" required />
          </label>

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Module or unit</span>
            <input className="field" value={form.module} onChange={update('module')} placeholder="e.g. Module 3" />
          </label>

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Topics</span>
            <textarea
              className="field min-h-[90px]"
              value={form.topics}
              onChange={update('topics')}
              placeholder="Demand analysis, elasticity, consumer behaviour"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Exam date</span>
            <input type="date" className="field" value={form.examDate} onChange={update('examDate')} />
            {daysLeft !== null && daysLeft >= 0 && (
              <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-muted">
                <CalendarDays size={14} /> {daysLeft} day{daysLeft === 1 ? '' : 's'} to go
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Marks pattern</span>
            <select className="field" value={form.marksPattern} onChange={update('marksPattern')}>
              {MARKS_PRESETS.map((preset) => (
                <option key={preset}>{preset}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">University or college pattern</span>
            <input
              className="field"
              value={form.pattern}
              onChange={update('pattern')}
              placeholder="e.g. VTU semester paper, internal choice in Part B"
            />
          </label>

          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            <GraduationCap size={16} /> Build exam pack
          </button>
        </form>

        <section className="space-y-4">
          {error && <ErrorNote message={error} />}

          {busy && (
            <div className="card p-6">
              <Spinner label="Building your exam pack" />
            </div>
          )}

          {!busy && !pack && !error && (
            <EmptyState
              icon={GraduationCap}
              title="Your exam pack will appear here"
              body="Fill in the subject and, if you know it, your marks pattern. The closer the pattern, the closer the questions."
            />
          )}

          {pack && (
            <article className="card p-6 sm:p-9">
              <div className="mb-5 flex justify-end">
                <button
                  onClick={() => downloadText(safeFileName(`${form.subject}-exam-pack`), pack)}
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={15} /> Download pack
                </button>
              </div>
              <Markdown>{pack}</Markdown>
            </article>
          )}
        </section>
      </div>
    </>
  );
}
