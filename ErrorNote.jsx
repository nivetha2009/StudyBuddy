import { AlertTriangle, RotateCw } from 'lucide-react';

/** One consistent, non-technical way to show a failure. */
export default function ErrorNote({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="card flex flex-col gap-3 border-coral p-4 sm:flex-row sm:items-center">
      <AlertTriangle size={20} className="shrink-0 text-coral" />
      <p className="flex-1 text-[15px]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm self-start">
          <RotateCw size={15} /> Try again
        </button>
      )}
    </div>
  );
}
