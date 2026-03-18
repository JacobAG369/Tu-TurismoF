import { create } from 'zustand';

let toastCounter = 0;

export const useToastStore = create((set) => ({
  toasts: [],

  pushToast: ({ title, description, variant = 'default' }) => {
    const id = `toast-${Date.now()}-${toastCounter++}`;

    set((state) => ({
      toasts: [...state.toasts, { id, title, description, variant }],
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3200);
  },

  dismissToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id),
  })),
}));
