import { create } from 'zustand';

/**
 * Notification UI Store
 * 
 * IMPORTANT: This store is ONLY for UI state (UI interactions, filters, visibility)
 * Notification data (actual notifications list) comes from useQuery via useNotifications hook
 * 
 * Architecture: Clean Architecture - Separation of concerns
 * - Query: Source of truth for data (notifications list)
 * - Store: Only handles UI state
 * - Hook: Coordinates between Query and Store
 */
export const useNotificationStore = create((set) => ({
  // UI State Only
  isNotificationPanelOpen: false,
  notificationSound: true,
  notificationPreference: 'all', // 'all' | 'important' | 'none'

  // UI Actions
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
