import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../api/favorites';
import { useAuthStore } from '../store/useAuthStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

const FAVORITES_QUERY_KEY = ['favorites'];

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

export function useFavorites() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const addFavoriteId = useFavoritesStore((state) => state.addFavoriteId);
  const removeFavoriteId = useFavoritesStore((state) => state.removeFavoriteId);
  const favorites = useFavoritesStore((state) => state.favorites);

  const favoritesQuery = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesApi.getFavorites,
    enabled: isAuthenticated,
    staleTime: 60000,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    if (favoritesQuery.data) {
      setFavorites(favoritesQuery.data.map((item) => item.referencia_id));
    }
  }, [favoritesQuery.data, isAuthenticated, setFavorites]);

  const addFavoriteMutation = useMutation({
    mutationFn: favoritesApi.addFavorite,
    onMutate: async (resource) => {
      const optimisticFavorite = normalizeFavorite(resource);

      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) || [];

      addFavoriteId(optimisticFavorite.referencia_id);
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (current = []) => [optimisticFavorite, ...current]);

      return { previousFavorites, optimisticFavorite };
    },
    onError: (_error, _resource, context) => {
      if (context?.optimisticFavorite) {
        removeFavoriteId(context.optimisticFavorite.referencia_id);
      }

      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
        setFavorites(context.previousFavorites.map((item) => item.referencia_id));
      }
    },
    onSuccess: (data, resource) => {
      addFavoriteId(resource.id);
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (current = []) => [data, ...current.filter((item) => item.referencia_id !== resource.id)]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: favoritesApi.removeFavorite,
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY) || [];

      removeFavoriteId(resourceId);
      queryClient.setQueryData(FAVORITES_QUERY_KEY, (current = []) => current.filter((item) => item.referencia_id !== resourceId));

      return { previousFavorites, resourceId };
    },
    onError: (_error, _resourceId, context) => {
      if (context?.resourceId) {
        addFavoriteId(context.resourceId);
      }

      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
        setFavorites(context.previousFavorites.map((item) => item.referencia_id));
      }
    },
    onSuccess: (_data, resourceId) => {
      removeFavoriteId(resourceId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const toggleFavorite = (resource) => {
    if (!resource?.id) {
      return;
    }

    if (favorites.includes(resource.id)) {
      removeFavoriteMutation.mutate(resource.id);
      return;
    }

    addFavoriteMutation.mutate(resource);
  };

  return {
    favorites,
    favoritesQuery,
    favoriteItems: favoritesQuery.data || [],
    isFavorite: (resourceId) => favorites.includes(resourceId),
    toggleFavorite,
    isUpdatingFavorite: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}
