import { createFileRoute, redirect } from '@tanstack/react-router';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { useAuthStore } from '../store/useAuthStore';

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }

    if (user?.rol !== 'admin') {
      throw redirect({ to: '/' });
    }
  },
  component: AdminDashboardPage,
});
