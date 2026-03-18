import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { useFavorites } from '../../../hooks/useFavorites';
import { useAuthStore } from '../../../store/useAuthStore';

export function FavoritesPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { favoriteItems, favoritesQuery, toggleFavorite } = useFavorites();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Inicia sesion para ver tus favoritos</CardTitle>
            <CardDescription>Guarda lugares, eventos y restaurantes para encontrarlos rapido.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button>Ir a iniciar sesion</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
          <Heart className="fill-current" size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mis favoritos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Todos los recursos que guardaste para volver a consultarlos.</p>
        </div>
      </div>

      {favoritesQuery.isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : favoriteItems.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Aun no tienes favoritos</CardTitle>
            <CardDescription>Explora el mapa y marca con corazon los recursos que quieras guardar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/map">
              <Button>Explorar mapa</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteItems.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden">
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                {favorite.recurso?.imagen ? (
                  <img src={favorite.recurso.imagen} alt={favorite.recurso.nombre} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <MapPin size={36} />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavorite({
                    id: favorite.referencia_id,
                    tipo: favorite.tipo,
                    nombre: favorite.recurso?.nombre,
                    imagen: favorite.recurso?.imagen,
                    rating: favorite.recurso?.rating,
                  })}
                  className="absolute right-3 top-3 border-red-200 bg-white/90 text-red-500 hover:bg-red-50 dark:border-red-900 dark:bg-slate-900/90 dark:text-red-400"
                  aria-label="Quitar de favoritos"
                >
                  <Heart size={18} className="fill-current" />
                </Button>
              </div>
              <CardHeader>
                <CardTitle>{favorite.recurso?.nombre || 'Recurso guardado'}</CardTitle>
                <CardDescription className="capitalize">{favorite.tipo}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-400" />
                  <span>{favorite.recurso?.rating ?? 'Sin rating'}</span>
                </div>
                <Link to="/map">
                  <Button variant="ghost" size="sm">Ver en mapa</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
