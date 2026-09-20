import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '../utils/cn.js';

const ACCEPTED = '.pdf,.ppt,.pptx,.doc,.docx,.txt,.md';
// Must not exceed the server's MAX_FILE_SIZE_MB, nor the host's request body
// limit (Vercel functions cap request bodies at about 4.5 MB).
const MAX_MB = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 15;
const ALLOWED_EXTENSIONS = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'txt', 'md'];

export default function FileDropzone({ onFile, busy }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  // Checked in the browser for fast feedback, and again on the server for safety.
  const validate = (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Please upload a supported file: PDF, PPT, PPTX, DOC, DOCX, TXT or MD.';
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return `That file is larger than ${MAX_MB} MB. Please upload a smaller file.`;
    }
    return '';
  };

  const handleFile = (file) => {
    if (!file) return;
    const message = validate(file);
    setLocalError(message);
    if (!message) onFile(file);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a study file"
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          'ruled grid cursor-pointer place-items-center rounded-card border-2 border-dashed px-6 py-12 text-center transition-colors',
          dragging ? 'border-pen bg-pen-soft' : 'hover:border-pen',
          busy && 'pointer-events-none opacity-60'
        )}
      >
        <UploadCloud size={28} className="text-pen" />
        <p className="mt-3 font-display text-xl">Drop a file, or click to choose one</p>
        <p className="mt-1.5 text-[15px] text-muted">PDF, PPTX, DOCX, TXT or MD, up to {MAX_MB} MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>
      {localError && <p className="mt-2 text-[15px] text-coral">{localError}</p>}
    </div>
  );
}
