import api from './axios';

export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/user/profile', userData);
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get('/favoritos');
  return response.data.data || [];
};

export const getFavoritePlaces = async () => {
  const favorites = await getFavorites();
  // Filter favorites by type 'lugar'
  return favorites.filter(fav => fav.tipo === 'lugar' || fav.tipo_recurso === 'lugar');
};

export const getFavoriteEvents = async () => {
  const favorites = await getFavorites();
  // Filter favorites by type 'evento'
  return favorites.filter(fav => fav.tipo === 'evento' || fav.tipo_recurso === 'evento');
};
