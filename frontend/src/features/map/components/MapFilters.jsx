import React from 'react';
import { CATEGORIES } from '../utils/icons';

export default function MapFilters({ activeCategory, onCategoryChange }) {
  return (
    <div className="absolute top-1/2 left-4 -translate-y-1/2 z-[400] flex flex-col gap-3">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`group relative p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center backdrop-blur-md border border-white/20
              ${isActive 
                ? 'bg-brand-600 text-white scale-110 shadow-brand-500/50' 
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:scale-105 shadow-black/10'
              }
            `}
            aria-label={cat.label}
          >
            <Icon size={24} className={isActive ? "text-white" : "text-brand-500 dark:text-brand-400"} />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-2.5 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              {cat.label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-700 transform rotate-45"></div>
            </span>
          </button>
        );
      })}
    </div>
  );
}
