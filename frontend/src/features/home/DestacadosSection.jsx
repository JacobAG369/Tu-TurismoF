import { useQuery } from '@tanstack/react-query';
import { getLugaresDestacados } from '../../api/home';
import { LugarCard } from '../../components/ui/cards/LugarCard';
import { SkeletonCard } from '../../components/ui/cards/SkeletonCard';

export const DestacadosSection = () => {
  const { data: lugares, isLoading, isError } = useQuery({
    queryKey: ['lugares', 'destacados'],
    queryFn: getLugaresDestacados
  });

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">Lugares Destacados</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Los mejores destinos seleccionados para ti</p>
          </div>
          <button className="hidden sm:block text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            Ver todos
          </button>
        </div>
        
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800 mb-8">
            Hubo un error al cargar los lugares destacados. Por favor, intenta de nuevo.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            lugares?.slice(0, 4).map((lugar) => (
              <LugarCard 
                key={lugar._id || lugar.id}
                id={lugar._id || lugar.id}
                title={lugar.nombre}
                image={lugar.imagenes?.[0] || lugar.imagen_principal}
                category={lugar.categoria?.nombre || 'Destacado'}
                rating={lugar.calificacion_promedio || 4.5}
                location={lugar.ubicacion?.direccion || lugar.ubicacion_texto}
                duration="2-3 horas"
                coords={lugar.ubicacion?.coordenadas || { lat: 20.6596, lng: -103.2494 }}
              />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            Ver todos los lugares
          </button>
        </div>
      </div>
    </section>
  );
};
