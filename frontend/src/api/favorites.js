import api from './axios';

export const favoritesApi = {
  getFavorites: async () => {
    const response = await api.get('/favoritos');
    return response.data.data || [];
  },

  addFavorite: async (resource) => {
    const response = await api.post('/favoritos', {
      tipo: resource.tipo || resource.tipo_recurso,
      referencia_id: resource.id,
    });

    return response.data.data;
  },

  removeFavorite: async (resourceId) => {
    const response = await api.delete(`/favoritos/${resourceId}`);
    return response.data.data;
  },
};
