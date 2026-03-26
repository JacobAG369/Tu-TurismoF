// maneja el estado del wizard de recuperación: email, en qué paso estamos y nada más.
import { create } from 'zustand';

export const useRecoveryStore = create((set) => ({
  step: 1, // 1 = Email, 2 = Código, 3 = Nueva contraseña
  email: '',
  code: '', // código verificado que se reutiliza en el reset

  setEmail: (email) => set({ email }),

  setCode: (code) => set({ code }),

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),

  reset: () => set({ step: 1, email: '', code: '' }),
}));
