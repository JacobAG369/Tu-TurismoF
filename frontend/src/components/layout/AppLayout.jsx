import { Outlet, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { useFavorites } from '../../hooks/useFavorites';
import { useThemeStore } from '../../store/useThemeStore';
import { ToastViewport } from '../ui/toast';

export function AppLayout() {
  const theme = useThemeStore((state) => state.theme);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMapRoute = pathname.startsWith('/map');

  useFavorites();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col pt-0 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!isMapRoute && <Footer />}
      <ToastViewport />
    </div>
  );
}
