import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/useAuthStore';

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Optional: Call logout endpoint if one exists
      // await api.post('/auth/logout');
      // For now, we just clear the local state
    },
    onSuccess: () => {
      useAuthStore.getState().clearSession();
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local session
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });
}
