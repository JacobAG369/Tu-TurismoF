// paso 2: introduce el código de 6 dígitos que llegó al correo.
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../../../components/ui/input-otp';
import { useVerifyCode } from '../../hooks/useVerifyCode';
import { useSendRecoveryCode } from '../../hooks/useSendRecoveryCode';
import { useRecoveryStore } from '../../store/useRecoveryStore';

const schema = z.object({
  code: z
    .string()
    .length(6, 'El código debe tener exactamente 6 dígitos.')
    .regex(/^\d+$/, 'El código solo puede contener números.'),
});

export function VerifyCodeForm() {
  const { email } = useRecoveryStore();
  const verifyCode = useVerifyCode();
  const sendCode = useSendRecoveryCode();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  });

  const handleSubmit = (values) => {
    verifyCode.mutate(values);
  };

  const handleResend = () => {
    sendCode.mutate({ email });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
        <div className="mb-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ingresa el código que enviamos a{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300 break-all">{email}</span>.
          </p>
        </div>

        <FormField
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col items-center gap-2">
              <FormLabel>Código de verificación</FormLabel>
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                inputMode="numeric"
                pattern="[0-9]*"
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={verifyCode.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 dark:bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {verifyCode.isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <ShieldCheck size={18} />
              Verificar código
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={sendCode.isPending}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={sendCode.isPending ? 'animate-spin' : ''} />
            Reenviar código
          </button>
        </div>
      </form>
    </Form>
  );
}
