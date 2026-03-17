import api from './axios';

/**
 * Maps API Service
 */
export const mapApi = {
  /**
   * Fetch map markers optionally filtered by category
   * @param {string|null} categoryId 
   * @returns {Promise<Array>} List of markers
   */
  getMarkers: async (categoryId = null) => {
    const params = {};
    if (categoryId) {
      params.categoria_id = categoryId;
    }
    const response = await api.get('/mapa/marcadores', { params });
    return response.data.data;
  },
  
  /**
   * Fetch nearby map markers
   * @param {number} lat 
   * @param {number} lng 
   * @param {number} radius Radius in kilometers
   * @returns {Promise<Array>} List of markers
   */
  getNearbyMarkers: async (lat, lng, radius = 5) => {
    const response = await api.get('/mapa/cercanos', { 
      params: { lat, lng, radius }
    });
    return response.data.data;
  }
};
