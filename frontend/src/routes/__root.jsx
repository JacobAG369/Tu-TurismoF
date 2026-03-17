import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useThemeStore } from '../store/useThemeStore';

export const Route = createRootRoute({
  component: () => {
    const theme = useThemeStore((state) => state.theme);

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
        <Footer />
      </div>
    );
  },
});
