import { createLazyFileRoute } from '@tanstack/react-router';
import { FavoritesPage } from '../features/favorites/pages/FavoritesPage';

export const Route = createLazyFileRoute('/favorites')({
  component: FavoritesPage,
});
