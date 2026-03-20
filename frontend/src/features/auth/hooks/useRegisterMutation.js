import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { useAuthStore } from '../../../store/useAuthStore';

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      // Register the user
      await api.post('/auth/register', userData);
      
      // Auto-login after successful registration
      const loginResponse = await api.post('/auth/login', {
        email: userData.email,
        password: userData.password,
      });
      
      return loginResponse.data?.data ?? loginResponse.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuthSession(data.user, data.token);
      queryClient.setQueryData(['auth-user'], data.user);
    },
    onError: (error) => {
      useAuthStore.getState().setError(
        error.response?.data?.message || 'No se pudo completar el registro.'
      );
    },
  });
}
