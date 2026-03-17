import { createLazyFileRoute } from '@tanstack/react-router';
import { ConfigPage } from '../features/user/pages/ConfigPage';

export const Route = createLazyFileRoute('/config')({
  component: ConfigPage,
});
