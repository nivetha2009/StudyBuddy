import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message, tone }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      notify: (message) => push(message, 'info'),
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error')
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="card pointer-events-auto flex max-w-md items-start gap-2.5 px-4 py-3 text-[15px] shadow-lift"
          >
            {toast.tone === 'error' ? (
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-coral" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-mint" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} aria-label="Dismiss" className="text-muted hover:text-ink">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
