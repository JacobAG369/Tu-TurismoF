import { createLazyFileRoute } from '@tanstack/react-router';
import NavigationMapPage from '../features/map/pages/NavigationMapPage';

export const Route = createLazyFileRoute('/map')({
  component: NavigationMapPage,
});
