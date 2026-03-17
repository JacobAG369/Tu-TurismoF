import { useQuery } from '@tanstack/react-query';
import { getRestaurantesRecomendados } from '../../api/home';
import { LugarCard } from '../../components/ui/cards/LugarCard';
import { SkeletonCard } from '../../components/ui/cards/SkeletonCard';

export const RestaurantesSection = () => {
  const { data: restaurantes, isLoading, isError } = useQuery({
    queryKey: ['restaurantes', 'recomendados'],
    queryFn: getRestaurantesRecomendados
  });

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">Restaurantes Recomendados</h2>
            <p className="text-slate-500 mt-2">Prueba los sabores tradicionales de nuestra tierra</p>
          </div>
          <button className="hidden sm:block text-primary-600 font-medium hover:text-primary-700 transition-colors">
            Ver todos
          </button>
        </div>
        
        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8">
            Hubo un error al cargar los restaurantes recomendados. Por favor, intenta de nuevo.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            restaurantes?.slice(0, 4).map((restaurante) => (
              <LugarCard 
                key={restaurante._id || restaurante.id}
                title={restaurante.nombre}
                image={restaurante.imagenes?.[0] || restaurante.imagen_principal}
                category={restaurante.categoria?.nombre || 'Restaurante'}
                rating={restaurante.calificacion_promedio || 4.8}
                location={restaurante.ubicacion?.direccion || restaurante.ubicacion_texto}
                duration="1-2 horas"
              />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
            Ver todos los restaurantes
          </button>
        </div>
      </div>
    </section>
  );
};
