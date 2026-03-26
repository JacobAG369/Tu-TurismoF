// paso 3: la nueva contraseña. tiene que ser decente.
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { useResetPassword } from '../../hooks/useResetPassword';
import { useRecoveryStore } from '../../store/useRecoveryStore';

// la contraseña debe tener mínimo 8 chars, 1 mayúscula, 1 número y 1 especial
const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres.')
  .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula.')
  .regex(/[0-9]/, 'Debe incluir al menos un número.')
  .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un carácter especial.');

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export function ResetPasswordForm() {
  const { email, code } = useRecoveryStore();
  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleSubmit = (values) => {
    resetPassword.mutate({ code, password: values.password });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
        <div className="mb-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Crea una nueva contraseña segura para{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300 break-all">{email}</span>.
          </p>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="reset-password">Nueva contraseña</FormLabel>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="pl-10 pr-10"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="reset-confirm">Confirmar contraseña</FormLabel>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="reset-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="pl-10 pr-10"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Indicadores de seguridad */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-3 space-y-1">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">La contraseña debe tener:</p>
          {[
            { label: 'Mínimo 8 caracteres', check: form.watch('password').length >= 8 },
            { label: 'Al menos una mayúscula', check: /[A-Z]/.test(form.watch('password')) },
            { label: 'Al menos un número', check: /[0-9]/.test(form.watch('password')) },
            { label: 'Al menos un carácter especial', check: /[^A-Za-z0-9]/.test(form.watch('password')) },
          ].map(({ label, check }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${check ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
              <span className={`text-xs ${check ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={resetPassword.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 dark:bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {resetPassword.isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <KeyRound size={18} />
              Restablecer contraseña
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
