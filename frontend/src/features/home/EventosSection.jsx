import { useQuery } from '@tanstack/react-query';
import { getEventosProximos } from '../../api/home';
import { EventoCard } from '../../components/ui/cards/EventoCard';
import { SkeletonCard } from '../../components/ui/cards/SkeletonCard';

export const EventosSection = () => {
  const { data: eventos, isLoading, isError } = useQuery({
    queryKey: ['eventos', 'proximos'],
    queryFn: getEventosProximos
  });

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
         <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">Próximos Eventos</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">No te pierdas de las actividades locales</p>
          </div>
          <button className="hidden sm:block text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            Ver agenda
          </button>
        </div>
        
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800 mb-8">
            Hubo un error al cargar los próximos eventos. Por favor, intenta de nuevo.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            eventos?.slice(0, 3).map((evento) => (
              <EventoCard 
                key={evento._id || evento.id}
                id={evento._id || evento.id}
                title={evento.titulo || evento.nombre}
                image={evento.imagenes?.[0] || evento.imagen_principal}
                date={evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : 'Próximamente'}
                location={evento.ubicacion?.direccion || evento.ubicacion_texto}
                category="Evento"
                coords={evento.ubicacion?.coordenadas || { lat: 20.6596, lng: -103.2494 }}
              />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            Ver todos los eventos
          </button>
        </div>
      </div>
    </section>
  );
};
