// envía el código al correo. throttle del backend: 5 req/min.
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../../../lib/axios';
import { useRecoveryStore } from '../store/useRecoveryStore';

export function useSendRecoveryCode() {
  const { setEmail, nextStep } = useRecoveryStore();

  return useMutation({
    mutationFn: async ({ email }) => {
      const response = await api.post('/auth/password/send-code', { email });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      setEmail(variables.email);
      nextStep();
      toast.success('Código enviado. Revisa tu correo.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'No se pudo enviar el código.';
      toast.error(message);
    },
  });
}
