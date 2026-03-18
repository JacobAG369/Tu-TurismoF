import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Lock, LogIn, Mail } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'El correo es obligatorio.').email('Ingresa un correo válido.'),
  password: z.string().min(1, 'La contraseña es obligatoria.').min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export function LoginForm({ onSuccess }) {
  const loginMutation = useLogin();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    const data = await loginMutation.mutateAsync(values);

    if (onSuccess) {
      onSuccess(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
        {loginMutation.isError && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-4 text-red-600 dark:text-red-400">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">{loginMutation.error?.response?.data?.message || 'No se pudo iniciar sesión.'}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="login-email">Correo electrónico</FormLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="pl-10"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-4">
                <FormLabel htmlFor="login-password">Contraseña</FormLabel>
                <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
                  Olvidé mi contraseña
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <FormControl>
                  <Input
                    {...field}
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
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
          disabled={loginMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-slate-800 dark:bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loginMutation.isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <LogIn size={20} />
              Iniciar sesión
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
