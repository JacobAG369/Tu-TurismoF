// el último paso: cambiar la contraseña de verdad.
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import api from '../../../lib/axios';
import { useRecoveryStore } from '../store/useRecoveryStore';

export function useResetPassword() {
  const { email, reset } = useRecoveryStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ code, password }) => {
      const response = await api.post('/auth/password/reset', { email, code, password, password_confirmation: password });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Contraseña actualizada. Inicia sesión.');
      reset();
      navigate({ to: '/login' });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'No se pudo restablecer la contraseña.';
      toast.error(message);
    },
  });
}
