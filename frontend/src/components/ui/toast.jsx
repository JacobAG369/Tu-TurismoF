import { X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[1000] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            'pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur-md',
            toast.variant === 'destructive'
              ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/90 dark:text-red-100'
              : 'border-slate-200 bg-white/95 text-slate-900 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100',
          ].join(' ')}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-full p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Cerrar notificacion"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
