import { useState, useEffect, useMemo } from 'react';
import { Camera, Save, ArrowLeft, User, Mail, Phone, Lock, Globe } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/useAuthStore';
import { updateUserProfile } from '../../../api/user';

export function ConfigPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState(() => ({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    password: '',
    password_confirmation: '',
  }));

  const [language, setLanguage] = useState('es');

  const initialFormData = useMemo(() => ({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    password: '',
    password_confirmation: '',
  }), [user?.nombre, user?.apellido, user?.email, user?.telefono]);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {

      const updatedUser = data.user || data;

      const currentToken = localStorage.getItem('token');
      if (updatedUser && currentToken) {
        localStorage.setItem('user', JSON.stringify(updatedUser));

      }
      queryClient.invalidateQueries(['user-profile']);
      navigate({ to: '/profile' });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Error al actualizar el perfil');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean empty password fields before sending
    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }
    updateMutation.mutate(payload);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Configuración</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Avatar and Language */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-slate-200 group">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.nombre || 'User'}&background=random`}
                alt="Profile"
                className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-slate-900 dark:text-white" />
              </div>
            </div>
            <button className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Cambiar Imagen
            </button>
          </div>

          {/* Language Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-400" />
              Idioma
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="es"
                  checked={language === 'es'}
                  onChange={() => setLanguage('es')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Español</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Inglés</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:focus:bg-slate-800 dark:text-white"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Apellido</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:focus:bg-slate-800 dark:text-white"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:focus:bg-slate-800 dark:text-white"
                    placeholder="tucorreo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:focus:bg-slate-800 dark:text-white"
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:focus:bg-slate-800 dark:text-white"
                    placeholder="Min. 8 caracteres"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Repetir Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:focus:bg-slate-800 dark:text-white"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white dark:bg-primary-500 dark:hover:bg-primary-600 hover:bg-slate-800 rounded-xl font-bold transition-all disabled:opacity-70"
              >
                {updateMutation.isPending ? (
                  <span className="animate-pulse">Guardando...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Registrar / Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
