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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
         <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">Próximos Eventos</h2>
            <p className="text-slate-500 mt-2">No te pierdas de las actividades locales</p>
          </div>
          <button className="hidden sm:block text-primary-600 font-medium hover:text-primary-700 transition-colors">
            Ver agenda
          </button>
        </div>
        
        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8">
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
                title={evento.titulo || evento.nombre}
                image={evento.imagenes?.[0] || evento.imagen_principal}
                date={evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : 'Próximamente'}
                location={evento.ubicacion?.direccion || evento.ubicacion_texto}
                category="Evento"
              />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
            Ver todos los eventos
          </button>
        </div>
      </div>
    </section>
  );
};
