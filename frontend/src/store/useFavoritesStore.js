// el estado de favoritos vive aquí. solo UI: filtros, sidebar. los datos reales los maneja React Query.
import { create } from 'zustand';

export const useFavoritesStore = create((set) => ({
  isSidebarOpen: false,
  filterType: null, // null | 'lugar' | 'evento' | 'restaurante'
  sortBy: 'created_at', // 'created_at' | 'nombre' | 'rating'

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
