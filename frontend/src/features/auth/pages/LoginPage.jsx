import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate, Link } from '@tanstack/react-router';
import { LoginForm } from '../components/LoginForm';
import tutuLogo from '../../../assets/tutu-logo.png';

export const LoginPage = () => {
  const { clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSuccess = () => {
    clearError();
    navigate({ to: '/' });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 my-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Logo Section */}
          <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-900 dark:to-slate-950 p-8 min-h-[400px]">
            <div className="text-center">
              <img
                src={tutuLogo}
                alt="Tu-Turismo Logo"
                className="w-48 h-48 object-contain mb-6 drop-shadow-lg"
              />
              <h1 className="text-3xl font-bold text-white mb-4">Tu-Turismo</h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-sm">

              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex flex-col">
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h2>
                <p className="text-slate-500 dark:text-slate-400">Inicia sesión para continuar</p>
              </div>

              <LoginForm onSuccess={handleSuccess} />
            </div>

            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center mt-auto">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No tienes una cuenta?{' '}
                <Link to="/register" className="font-medium text-slate-900 dark:text-white hover:underline">
                  Registrate aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
