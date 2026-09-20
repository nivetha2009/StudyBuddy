import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Sparkles, Copy, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import MaterialPicker from '../components/MaterialPicker.jsx';
import OptionChips from '../components/OptionChips.jsx';
import Markdown from '../components/Markdown.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorNote from '../components/ErrorNote.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useStudy } from '../context/StudyContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { downloadText, safeFileName } from '../utils/download.js';

const STYLES = [
  { value: 'quick', label: 'Quick revision' },
  { value: 'detailed', label: 'Detailed notes' },
  { value: 'beginner', label: 'Beginner explanation' },
  { value: 'exam', label: 'Exam notes' }
];

export default function Notes() {
  const [searchParams] = useSearchParams();
  const summaryFirst = searchParams.get('view') === 'summary';

  const { activeMaterial, activeMaterialId, recordEvent } = useStudy();
  const toast = useToast();

  const [style, setStyle] = useState('quick');
  const [topic, setTopic] = useState('');
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const source = activeMaterial?.name || topic || 'studybuddy-notes';

  const generate = async (kind = 'notes') => {
    if (!activeMaterialId && !topic.trim()) {
      setError('Choose an uploaded material or type a topic first.');
      return;
    }

    setError('');
    setBusy(true);
    setOutput('');

    try {
      const payload = { materialId: activeMaterialId || undefined, topic: topic.trim() || undefined };
      const data =
        kind === 'summary' ? await api.summary(payload) : await api.notes({ ...payload, style });

      setOutput(kind === 'summary' ? data.summary : data.notes);
      recordEvent('notes');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Copying is blocked in this browser. Select the text and copy it manually.');
    }
  };

  return (
    <>
      <PageHeader
        title="Smart notes"
        subtitle="Turn a chapter into notes you can actually revise from, with definitions, examples and likely questions."
      />

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-5">
          <MaterialPicker />

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Topic (optional)</span>
            <input
              className="field"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Chapter 4, Ohm's law"
            />
          </label>

          <OptionChips label="Note style" options={STYLES} value={style} onChange={setStyle} />

          <div className="flex flex-wrap gap-2">
            <button onClick={() => generate('notes')} className="btn btn-primary" disabled={busy}>
              <Sparkles size={16} /> Generate notes
            </button>
            <button onClick={() => generate('summary')} className="btn btn-secondary" disabled={busy}>
              Summary only
            </button>
          </div>

          {summaryFirst && !output && !busy && (
            <p className="text-[15px] text-muted">Choose “Summary only” for a short version of this material.</p>
          )}
        </aside>

        <section className="space-y-4">
          {error && <ErrorNote message={error} onRetry={() => generate('notes')} />}

          {busy && (
            <div className="card p-6">
              <Spinner label="Writing your notes" />
            </div>
          )}

          {!busy && !output && !error && (
            <EmptyState
              icon={Sparkles}
              title="Your notes will appear here"
              body="Pick a material or type a topic on the left, choose a style, and generate."
            />
          )}

          {output && (
            <article className="card p-6 sm:p-9">
              <div className="mb-5 flex flex-wrap justify-end gap-2">
                <button onClick={copy} className="btn btn-ghost btn-sm">
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => downloadText(safeFileName(`${source}-notes`), output)}
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={15} /> Download notes
                </button>
              </div>
              <Markdown>{output}</Markdown>
            </article>
          )}
        </section>
      </div>
    </>
  );
}
