import { create } from 'zustand';

export const useMapStore = create((set) => ({
  activeCategory: 'all',
  selectedMarkerId: null,
  mapCenter: null,

  setActiveCategory: (category) => set({ activeCategory: category }),
  setSelectedMarkerId: (id) => set({ selectedMarkerId: id }),
  setMapCenter: (center) => set({ mapCenter: center }),
}));
