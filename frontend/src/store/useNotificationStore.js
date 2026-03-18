import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  unreadCount: 0,
  lastNotification: null,

  incrementUnread: (notification) => set((state) => ({
    unreadCount: state.unreadCount + 1,
    lastNotification: notification,
  })),

  clearUnread: () => set({ unreadCount: 0 }),
}));
