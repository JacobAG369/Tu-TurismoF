import { create } from 'zustand';

export const useFavoritesStore = create((set) => ({
  favorites: [],

  setFavorites: (favorites) => set({ favorites }),

  addFavoriteId: (favoriteId) => set((state) => ({
    favorites: state.favorites.includes(favoriteId)
      ? state.favorites
      : [...state.favorites, favoriteId],
  })),

  removeFavoriteId: (favoriteId) => set((state) => ({
    favorites: state.favorites.filter((id) => id !== favoriteId),
  })),
}));
