// paso 1: pide el correo para enviar el código de recuperación.
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Send } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { useSendRecoveryCode } from '../../hooks/useSendRecoveryCode';

const schema = z.object({
  email: z.string().trim().min(1, 'El correo es obligatorio.').email('Ingresa un correo válido.'),
});

export function RequestCodeForm() {
  const sendCode = useSendRecoveryCode();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const handleSubmit = (values) => {
    sendCode.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
        <div className="mb-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Te enviaremos un código de 6 dígitos para restablecer tu contraseña.
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="recovery-email">Correo electrónico</FormLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="recovery-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    className="pl-10"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={sendCode.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 dark:bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sendCode.isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <Send size={18} />
              Enviar código
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
