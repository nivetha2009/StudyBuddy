import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import ErrorNote from '../components/ErrorNote.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useStudy } from '../context/StudyContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatBytes, formatDate } from '../utils/format.js';
import { cn } from '../utils/cn.js';

const ACTIONS = [
  { label: 'Generate Notes', to: '/notes' },
  { label: 'Generate Summary', to: '/notes?view=summary' },
  { label: 'Generate MCQs', to: '/mcqs' },
  { label: 'Generate Flashcards', to: '/flashcards' },
  { label: 'Ask Questions', to: '/tutor' },
  { label: 'Create Quiz', to: '/quiz' },
  { label: 'Generate Exam Questions', to: '/exam-prep' }
];

export default function Materials() {
  const { materials, activeMaterialId, setActiveMaterialId, refreshMaterials } = useStudy();
  const toast = useToast();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    setError('');
    setUploading(true);
    try {
      const material = await api.uploadMaterial(file);
      await refreshMaterials();
      setActiveMaterialId(material.id);
      toast.success(`${material.name} is ready to study from.`);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id, name) => {
    try {
      await api.deleteMaterial(id);
      await refreshMaterials();
      toast.success(`${name} removed.`);
    } catch (deleteError) {
      toast.error(deleteError.message);
    }
  };

  const openTool = (material, to) => {
    setActiveMaterialId(material.id);
    navigate(to);
  };

  return (
    <>
      <PageHeader
        title="Study materials"
        subtitle="Upload a chapter, a slide deck or your own notes. Every tool in StudyBuddy can then work from it."
      />

      <div className="container-page space-y-8 py-8">
        <FileDropzone onFile={upload} busy={uploading} />

        {uploading && (
          <div className="card p-4">
            <Spinner label="Reading your file and pulling out the text" />
          </div>
        )}

        <ErrorNote message={error} />

        {!materials.length && !uploading ? (
          <EmptyState
            icon={FileText}
            title="Nothing uploaded yet"
            body="Start with one chapter rather than a whole textbook. Smaller files give sharper questions and faster answers."
          />
        ) : (
          <ul className="space-y-4">
            {materials.map((material) => {
              const active = material.id === activeMaterialId;
              return (
                <li key={material.id} className={cn('card p-5 sm:p-6', active && 'border-pen')}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="shrink-0 text-pen" />
                        <h2 className="truncate font-display text-xl">{material.name}</h2>
                      </div>
                      <p className="mt-1.5 text-[14px] text-muted">
                        {formatBytes(material.sizeBytes)} · {material.words.toLocaleString()} words ·{' '}
                        {material.pages ? `${material.pages} pages · ` : ''}~{material.readingMinutes} min read ·
                        uploaded {formatDate(material.uploadedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {active ? (
                        <span className="chip chip-active">
                          <CheckCircle2 size={14} /> In use
                        </span>
                      ) : (
                        <button onClick={() => setActiveMaterialId(material.id)} className="btn btn-secondary btn-sm">
                          Use this
                        </button>
                      )}
                      <button
                        onClick={() => remove(material.id, material.name)}
                        className="btn btn-ghost btn-sm"
                        aria-label={`Remove ${material.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="card-quiet mt-4 line-clamp-3 p-4 text-[15px] text-muted">{material.preview}…</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => openTool(material, action.to)}
                        className="chip text-muted hover:border-pen hover:text-ink"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-[15px] text-muted">
          Files are held in the server for this session only and are cleared when the server restarts. Scanned pages
          without a text layer cannot be read yet.
        </p>
      </div>
    </>
  );
}
