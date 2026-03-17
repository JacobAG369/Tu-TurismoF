import { create } from 'zustand';

export const useMapStore = create((set) => ({
  activeCategory: 'all',
  selectedMarkerId: null,

  setActiveCategory: (category) => set({ activeCategory: category }),
  setSelectedMarkerId: (id) => set({ selectedMarkerId: id }),
}));
