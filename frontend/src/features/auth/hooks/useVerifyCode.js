// valida el código de 6 dígitos contra el backend.
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../../../lib/axios';
import { useRecoveryStore } from '../store/useRecoveryStore';

export function useVerifyCode() {
  const { email, setCode, nextStep } = useRecoveryStore();

  return useMutation({
    mutationFn: async ({ code }) => {
      const response = await api.post('/auth/password/verify-code', { email, code });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      setCode(variables.code);
      nextStep();
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Código inválido o expirado.';
      toast.error(message);
    },
  });
}
