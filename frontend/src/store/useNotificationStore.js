// estado de notificaciones: solo UI (panel abierto, sonido, preferencias). los datos están en React Query.
import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  isNotificationPanelOpen: false,
  notificationSound: true,
  notificationPreference: 'all', // 'all' | 'important' | 'none'

  setNotificationPanelOpen: (isOpen) => set({ isNotificationPanelOpen: isOpen }),
  toggleNotificationPanel: () =>
    set((state) => ({ isNotificationPanelOpen: !state.isNotificationPanelOpen })),

  setNotificationSound: (enabled) => set({ notificationSound: enabled }),
  setNotificationPreference: (preference) =>
    set({ notificationPreference: preference }),

  reset: () =>
    set({
      isNotificationPanelOpen: false,
      notificationSound: true,
      notificationPreference: 'all',
    }),
}));
