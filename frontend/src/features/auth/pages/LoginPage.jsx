import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate, Link } from '@tanstack/react-router';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const { clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSuccess = () => {
    clearError();
    navigate({ to: '/' });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h2>
            <p className="text-slate-500 dark:text-slate-400">Ingresa tus credenciales para continuar.</p>
          </div>

          <LoginForm onSuccess={handleSuccess} />
        </div>
        
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-slate-900 dark:text-white hover:underline">
              Registrate aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
