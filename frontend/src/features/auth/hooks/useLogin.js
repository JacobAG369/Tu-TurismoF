import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { useAuthStore } from '../../../store/useAuthStore';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data?.data ?? response.data;
    },
    onMutate: () => {
      useAuthStore.getState().setLoading(true);
      useAuthStore.getState().clearError();
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuthSession(data.user, data.token);
      queryClient.setQueryData(['auth-user'], data.user);
    },
    onError: (error) => {
      useAuthStore.getState().setError(error.response?.data?.message || 'No se pudo iniciar sesión.');
    },
    onSettled: () => {
      useAuthStore.getState().setLoading(false);
    },
  });
}
