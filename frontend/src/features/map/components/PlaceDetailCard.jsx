import React from 'react';
import { X, MapPin, Phone, Globe, Clock, Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../../../api/favorites';
import { useAuthStore } from '../../../store/useAuthStore';

export default function PlaceDetailCard({ marker, onClose }) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Optionally, you might want to fetch whether it's already a favorite
  // Let's assume for now we just have a toggle action
  const toggleFavoriteMutation = useMutation({
    mutationFn: (id) => favoritesApi.toggleFavorite(id),
    onSuccess: () => {
      // Invalidate favorites if needed
      queryClient.invalidateQueries({ queryKey: ['favorite-places'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-events'] });
    },
  });

  if (!marker) return null;

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar a favoritos');
      return;
    }
    toggleFavoriteMutation.mutate(marker.id);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 w-[calc(100%-2rem)] md:w-80 z-[400] transition-transform duration-300 pointer-events-auto transform-gpu">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden flex flex-col">
        {/* Header Image */}
        <div className="relative h-40 bg-slate-200 dark:bg-slate-800 shrink-0 w-full">
          {marker.imagen_url ? (
            <img 
              src={marker.imagen_url} 
              alt={marker.nombre} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400&auto=format&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
              <MapPin size={40} className="opacity-50" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors z-10"
            aria-label="Cerrar detalles"
          >
            <X size={18} />
          </button>
          
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-brand-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              {marker.tipo || 'Lugar'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
            {marker.nombre}
          </h2>
          
          <div className="flex items-center gap-1.5 text-sm font-medium h-4">
            <Star size={14} className="fill-current text-yellow-400" />
            <span className="text-yellow-500">{marker.rating || '4.8'}</span>
            <span className="text-slate-400 dark:text-slate-500 ml-0.5 text-xs font-normal">
              ({marker.reviews_count || '120'})
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
            {marker.descripcion || 'Descubre más sobre este increíble lugar y planifica tu visita en Tu-Turismo.'}
          </p>

          {/* Info Items */}
          <div className="space-y-2 mt-1">
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <MapPin size={14} className="text-brand-500 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{marker.direccion || 'Dirección no disponible'}</span>
            </div>

            {(marker.horario || marker.tipo === 'restaurante') && (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Clock size={14} className="text-brand-500 shrink-0" />
                <span className="pr-1 truncate">{marker.horario || '09:00 - 18:00'}</span>
              </div>
            )}

            {(marker.telefono || marker.tipo === 'hotel') && (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Phone size={14} className="text-brand-500 shrink-0" />
                <span className="truncate">{marker.telefono || '+52 123 456 7890'}</span>
              </div>
            )}
            
            {(marker.sitio_web || marker.tipo === 'lugar') && (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Globe size={14} className="text-brand-500 shrink-0" />
                <a href={marker.sitio_web || '#'} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600 hover:underline truncate">
                  {marker.sitio_web || 'Visitar sitio web'}
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors shadow-lg shadow-brand-500/20">
              Ver detalles
            </button>
            <button 
              onClick={handleFavoriteClick}
              disabled={toggleFavoriteMutation.isPending}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-red-500 disabled:opacity-50"
              aria-label="Agregar a favoritos"
            >
              <Star size={20} className={toggleFavoriteMutation.isPending ? "animate-pulse" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
