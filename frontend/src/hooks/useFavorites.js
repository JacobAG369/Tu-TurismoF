import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../api/favorites';
import { useAuthStore } from '../store/useAuthStore';

const FAVORITES_QUERY_KEY = ['favorites'];

/**
 * Normalize favorite resource into standard format
 */
function normalizeFavorite(resource) {
  return {
    id: resource.id,
    referencia_id: resource.id,
    tipo: resource.tipo || resource.tipo_recurso,
    recurso: {
      id: resource.id,
      nombre: resource.nombre,
      imagen: resource.imagen_url || resource.imagen || resource.imagenes?.[0] || null,
      rating: resource.rating || resource.rating_promedio || null,
    },
  };
}

/**
 * useFavorites Hook
 * 
 * SINGLE SOURCE OF TRUTH: useQuery
 * - Favorites data lives only in React Query
 * - Mutations automatically sync via optimistic updates + invalidation
 * - isFavorite() derives state from query data using .some()
 * - No duplicate state in Zustand
 * 
 * Optimistic Updates:
 * - onMutate: Update UI immediately
 * - onError: Rollback if request fails
 * - onSettled: Refetch to ensure consistency
 * 
 * Architecture: Clean Architecture + TanStack Query best practices
 */
export function useFavorites() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // ============================================================================
  // QUERY: Single source of truth for favorite data
  // ============================================================================
  const favoritesQuery = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesApi.getFavorites,
    enabled: isAuthenticated,
    staleTime: 60000, // 1 minute
    placeholderData: [], // Show empty while loading
  });

  // ============================================================================
  // DERIVED STATE: isFavorite derived from query data
  // ============================================================================
  const isFavorite = (resourceId) => {
    if (!favoritesQuery.data) return false;
    return favoritesQuery.data.some((item) => item.referencia_id === resourceId);
  };

  // ============================================================================
  // MUTATION: Add favorite with optimistic update
  // ============================================================================
  const addFavoriteMutation = useMutation({
    mutationFn: favoritesApi.addFavorite,
    
    // Step 1: Optimistic update (immediate UI feedback)
    onMutate: async (resource) => {
      const optimisticFavorite = normalizeFavorite(resource);

      // Cancel ongoing requests to avoid overwriting
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      // Save previous data for rollback
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) || [];

      // Update UI immediately (optimistic)
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (current = []) => [
        optimisticFavorite,
        ...current,
      ]);

      return { previousFavorites, optimisticFavorite };
    },

    // Step 2: Error handling (rollback on failure)
    onError: (_error, _resource, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },

    // Step 3: Refresh data after mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  // ============================================================================
  // MUTATION: Remove favorite with optimistic update
  // ============================================================================
  const removeFavoriteMutation = useMutation({
    mutationFn: favoritesApi.removeFavorite,

    // Step 1: Optimistic update (immediate UI feedback)
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) || [];

      // Update UI immediately (optimistic)
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (current = []) =>
        current.filter((item) => item.referencia_id !== resourceId)
      );

      return { previousFavorites, resourceId };
    },

    // Step 2: Error handling (rollback on failure)
    onError: (_error, _resourceId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },

    // Step 3: Refresh data after mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  // ============================================================================
  // Action: Toggle favorite (add or remove)
  // ============================================================================
  const toggleFavorite = (resource) => {
    if (!resource?.id) {
      console.warn('toggleFavorite: resource.id is required');
      return;
    }

    // Check if already favorited using derived state
    if (isFavorite(resource.id)) {
      removeFavoriteMutation.mutate(resource.id);
    } else {
      addFavoriteMutation.mutate(resource);
    }
  };

  // ============================================================================
  // Return hook API
  // ============================================================================
  return {
    // Data: From query (single source of truth)
    favoriteItems: favoritesQuery.data || [],

    // Derived: Computed from query data
    isFavorite,

    // Query state
    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    error: favoritesQuery.error,

    // Mutation state
    isUpdatingFavorite:
      addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,

    // Actions
    toggleFavorite,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,

    // Advanced: Direct access to query for components that need it
    favoritesQuery,
  };
}
