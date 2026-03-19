import { create } from 'zustand';

/**
 * Favorites UI Store
 * 
 * IMPORTANT: This store is ONLY for UI state (UI interactions, filters, sorting)
 * Favorite data (actual favorites list) comes from useQuery via useFavorites hook
 * 
 * Architecture: Clean Architecture - Separation of concerns
 * - Query: Source of truth for data (favorites list)
 * - Store: Only handles UI state
 * - Hook: Coordinates between Query and Store
 */
export const useFavoritesStore = create((set) => ({
  // UI State Only
  isSidebarOpen: false,
  filterType: null, // null | 'lugar' | 'evento' | 'restaurante'
  sortBy: 'created_at', // 'created_at' | 'nombre' | 'rating'

  // UI Actions
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setFilterType: (type) => set({ filterType: type }),
  setSortBy: (sort) => set({ sortBy: sort }),

  reset: () => set({
    isSidebarOpen: false,
    filterType: null,
    sortBy: 'created_at',
  }),
}));
