import { Search, User } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ThemeToggle } from '../ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">
          Tu-Turismo
        </Link>

        {/* Search Bar - hidden on very small screens */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-full max-w-sm transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:bg-white dark:focus-within:bg-slate-900">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar lugares, eventos..." 
            className="bg-transparent border-none outline-none w-full text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Navigation & Profile */}
        <nav className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-primary dark:hover:text-primary transition-colors">Lugares</Link>
            <Link to="/" className="hover:text-primary dark:hover:text-primary transition-colors">Eventos</Link>
            <Link to="/" className="hover:text-primary dark:hover:text-primary transition-colors">Restaurantes</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
