import api from './axios';

/**
 * API endpoints for managing favorites
 */
export const favoritesApi = {
  /**
   * Toggle a place/event as favorite
   * @param {string} lugarId ID of the place or event
   * @returns {Promise<Object>} Response object containing status and message
   */
  toggleFavorite: async (lugarId) => {
    const response = await api.post('/favoritos', { lugar_id: lugarId });
    return response.data;
  }
};
