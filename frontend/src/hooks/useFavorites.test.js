/**
 * Test Suite: Optimistic Updates for Favorites
 * 
 * Verifies that UI updates immediately when user toggles favorite
 * And rolls back if server request fails
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFavorites } from '../hooks/useFavorites';
import * as favoritesApi from '../api/favorites';

// Mock the API
jest.mock('../api/favorites');

describe('useFavorites - Optimistic Updates', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('addFavorite - Optimistic Update', () => {
    test('UI updates immediately when adding favorite', async () => {
      // Setup: Mock API returns success
      favoritesApi.addFavorite.mockResolvedValue({
        id: 'fav-1',
        referencia_id: 'place-1',
        tipo: 'lugar',
      });

      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Initial state: not favorited
      expect(result.current.isFavorite('place-1')).toBe(false);

      // User clicks heart icon
      const resource = { id: 'place-1', nombre: 'Test Place', tipo: 'lugar' };

      act(() => {
        result.current.toggleFavorite(resource);
      });

      // 🎯 KEY ASSERTION: UI updates IMMEDIATELY (optimistic)
      // This happens before server response
      expect(result.current.isFavorite('place-1')).toBe(true);
      expect(result.current.isUpdatingFavorite).toBe(true);

      // Wait for mutation to settle
      await waitFor(() => {
        expect(result.current.isUpdatingFavorite).toBe(false);
      });

      // After server confirms, still favorited
      expect(result.current.isFavorite('place-1')).toBe(true);
      expect(favoritesApi.addFavorite).toHaveBeenCalledWith(resource);
    });

    test('Optimistic update is rolled back on error', async () => {
      // Setup: Mock API returns error
      const error = new Error('Network error');
      favoritesApi.addFavorite.mockRejectedValue(error);

      // Setup: Pre-populate query with existing favorites
      queryClient.setQueryData(['favorites'], [
        { id: 'fav-2', referencia_id: 'place-2', tipo: 'lugar' },
      ]);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      const resource = { id: 'place-1', nombre: 'Test Place', tipo: 'lugar' };

      act(() => {
        result.current.toggleFavorite(resource);
      });

      // UI updated optimistically
      expect(result.current.isFavorite('place-1')).toBe(true);

      // Wait for error
      await waitFor(() => {
        expect(result.current.isUpdatingFavorite).toBe(false);
      });

      // 🎯 KEY ASSERTION: Rollback on error
      // UI reverts to previous state
      expect(result.current.isFavorite('place-1')).toBe(false);
      expect(result.current.isFavorite('place-2')).toBe(true);
    });

    test('Multiple optimistic updates work correctly', async () => {
      favoritesApi.addFavorite.mockImplementation((resource) =>
        Promise.resolve({
          id: `fav-${resource.id}`,
          referencia_id: resource.id,
          tipo: resource.tipo,
        })
      );

      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Add multiple favorites rapidly
      const places = [
        { id: 'place-1', nombre: 'Place 1', tipo: 'lugar' },
        { id: 'place-2', nombre: 'Place 2', tipo: 'lugar' },
        { id: 'place-3', nombre: 'Place 3', tipo: 'lugar' },
      ];

      act(() => {
        places.forEach((place) => result.current.toggleFavorite(place));
      });

      // All should be optimistically favorited
      expect(result.current.isFavorite('place-1')).toBe(true);
      expect(result.current.isFavorite('place-2')).toBe(true);
      expect(result.current.isFavorite('place-3')).toBe(true);

      // Wait for all mutations
      await waitFor(() => {
        expect(result.current.isUpdatingFavorite).toBe(false);
      });

      // All still favorited after server confirms
      expect(result.current.isFavorite('place-1')).toBe(true);
      expect(result.current.isFavorite('place-2')).toBe(true);
      expect(result.current.isFavorite('place-3')).toBe(true);
    });
  });

  describe('removeFavorite - Optimistic Update', () => {
    test('UI updates immediately when removing favorite', async () => {
      favoritesApi.removeFavorite.mockResolvedValue({});

      // Setup: Pre-populate with a favorite
      queryClient.setQueryData(['favorites'], [
        {
          id: 'fav-1',
          referencia_id: 'place-1',
          tipo: 'lugar',
          recurso: { nombre: 'Test Place' },
        },
      ]);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Initial state: favorited
      expect(result.current.isFavorite('place-1')).toBe(true);

      // User removes favorite
      act(() => {
        result.current.removeFavorite('place-1');
      });

      // 🎯 KEY ASSERTION: UI updates IMMEDIATELY (optimistic)
      expect(result.current.isFavorite('place-1')).toBe(false);
      expect(result.current.isUpdatingFavorite).toBe(true);

      // Wait for mutation
      await waitFor(() => {
        expect(result.current.isUpdatingFavorite).toBe(false);
      });

      // Still removed after server confirms
      expect(result.current.isFavorite('place-1')).toBe(false);
    });

    test('Optimistic removal is rolled back on error', async () => {
      favoritesApi.removeFavorite.mockRejectedValue(new Error('Network error'));

      // Setup: Pre-populate with a favorite
      const initialFavorites = [
        {
          id: 'fav-1',
          referencia_id: 'place-1',
          tipo: 'lugar',
          recurso: { nombre: 'Test Place' },
        },
      ];
      queryClient.setQueryData(['favorites'], initialFavorites);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Remove favorite
      act(() => {
        result.current.removeFavorite('place-1');
      });

      // Optimistically removed
      expect(result.current.isFavorite('place-1')).toBe(false);

      // Wait for error
      await waitFor(() => {
        expect(result.current.isUpdatingFavorite).toBe(false);
      });

      // 🎯 KEY ASSERTION: Rollback on error
      expect(result.current.isFavorite('place-1')).toBe(true);
    });
  });

  describe('isFavorite - Derived State', () => {
    test('isFavorite is derived from query data', () => {
      queryClient.setQueryData(['favorites'], [
        { id: 'fav-1', referencia_id: 'place-1' },
        { id: 'fav-2', referencia_id: 'place-2' },
      ]);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Check multiple resources
      expect(result.current.isFavorite('place-1')).toBe(true);
      expect(result.current.isFavorite('place-2')).toBe(true);
      expect(result.current.isFavorite('place-3')).toBe(false);
    });

    test('isFavorite updates automatically when query data changes', async () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Initial: empty
      expect(result.current.isFavorite('place-1')).toBe(false);

      // Update query data
      act(() => {
        queryClient.setQueryData(['favorites'], [
          { id: 'fav-1', referencia_id: 'place-1' },
        ]);
      });

      // 🎯 KEY ASSERTION: isFavorite updates automatically
      expect(result.current.isFavorite('place-1')).toBe(true);
    });
  });

  describe('Query Invalidation', () => {
    test('Query is invalidated after successful mutation', async () => {
      favoritesApi.getFavorites.mockResolvedValue([]);
      favoritesApi.addFavorite.mockResolvedValue({
        id: 'fav-1',
        referencia_id: 'place-1',
      });

      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Wait for initial query
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const resource = { id: 'place-1', nombre: 'Test', tipo: 'lugar' };

      act(() => {
        result.current.toggleFavorite(resource);
      });

      // Should refetch after mutation settles
      await waitFor(() => {
        expect(favoritesApi.getFavorites).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    test('isFavorite handles null/undefined query data gracefully', () => {
      // Query data is undefined
      queryClient.setQueryData(['favorites'], undefined);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      // Should return false, not crash
      expect(result.current.isFavorite('place-1')).toBe(false);
    });

    test('Rapid toggle (add then remove) works correctly', async () => {
      favoritesApi.addFavorite.mockResolvedValue({
        id: 'fav-1',
        referencia_id: 'place-1',
      });
      favoritesApi.removeFavorite.mockResolvedValue({});

      const { result } = renderHook(() => useFavorites(), { wrapper });

      const resource = { id: 'place-1', nombre: 'Test', tipo: 'lugar' };

      // Add
      act(() => {
        result.current.toggleFavorite(resource);
      });
      expect(result.current.isFavorite('place-1')).toBe(true);

      // Remove (toggle again)
      act(() => {
        result.current.toggleFavorite(resource);
      });
      expect(result.current.isFavorite('place-1')).toBe(false);
    });
  });
});
