import api from './axios';

export const getLugaresDestacados = async () => {
  const { data } = await api.get('/lugares/destacados');
  return data.data || data; // Assuming standardized response `{ data: [...] }`
};

export const getEventosProximos = async () => {
  const { data } = await api.get('/eventos/proximos');
  return data.data || data;
};

export const getCategorias = async () => {
  const { data } = await api.get('/categorias');
  return data.data || data;
};

export const getRestaurantesRecomendados = async () => {
  const { data } = await api.get('/restaurantes/recomendados');
  return data.data || data;
};
