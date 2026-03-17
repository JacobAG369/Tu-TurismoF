import { createLazyFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '../features/user/pages/ProfilePage';

export const Route = createLazyFileRoute('/profile')({
  component: ProfilePage,
});
