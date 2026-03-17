import { create } from 'zustand';

export const useHomeStore = create((set) => ({
  activeTab: 'all', // Example state
  setActiveTab: (tab) => set({ activeTab: tab }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
