import { X } from 'lucide-react';
import { createContext, useContext } from 'react';

const DialogContext = createContext({ open: false, onOpenChange: () => {} });

export function Dialog({ open, onOpenChange, children }) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }) {
  return children;
}

export function DialogContent({ children, className = '' }) {
  const { open, onOpenChange } = useContext(DialogContext);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-slate-950/60 p-4">
      <div className={`relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 ${className}`}>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
          aria-label="Cerrar dialogo"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-6 space-y-2">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>;
}
