// favoritos con actualizaciones optimistas. si falla el servidor, el UI se revierte solo.
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
 * useFavorites Hook — fuente única de verdad via useQuery con actualizaciones optimistas.
 */
export function useFavorites() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // fuente única de verdad para favoritos
  const favoritesQuery = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesApi.getFavorites,
    enabled: isAuthenticated,
    staleTime: 60000,
    placeholderData: [],
  });

  // isFavorite se deriva de los datos del query
  const isFavorite = (resourceId) => {
    if (!favoritesQuery.data) return false;
    return favoritesQuery.data.some((item) => item.referencia_id === resourceId);
  };

  // agregar favorito con actualización optimista
  const addFavoriteMutation = useMutation({
    mutationFn: favoritesApi.addFavorite,
    
    onMutate: async (resource) => {
      const optimisticFavorite = normalizeFavorite(resource);

      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) || [];

      queryClient.setQueryData(FAVORITES_QUERY_KEY, (current = []) => [
        optimisticFavorite,
        ...current,
      ]);

      return { previousFavorites, optimisticFavorite };
    },

    // si falla, rollback
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

  // eliminar favorito con actualización optimista
  const removeFavoriteMutation = useMutation({
    mutationFn: favoritesApi.removeFavorite,

    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) || [];

      queryClient.setQueryData(FAVORITES_QUERY_KEY, (current = []) =>
        current.filter((item) => item.referencia_id !== resourceId)
      );

      return { previousFavorites, resourceId };
    },

    // si falla, rollback
    onError: (_error, _resourceId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },

    // refrescar luego de la mutación
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  // toggle: agrega o elimina según el estado actual
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

  return {
    favoriteItems: favoritesQuery.data || [],

    isFavorite,

    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    error: favoritesQuery.error,

    isUpdatingFavorite:
      addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,

    toggleFavorite,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,

    favoritesQuery,
  };
}
