import { CATEGORIES } from '../utils/icons';
import { useMapStore } from '../../../store/useMapStore';

export default function FloatingFilters() {
  const activeCategory = useMapStore((state) => state.activeCategory);
  const setActiveCategory = useMapStore((state) => state.setActiveCategory);

  return (
    <div
      className="absolute top-1/2 left-4 z-[400] flex -translate-y-1/2 flex-col gap-3"
      role="group"
      aria-label="Filtros del mapa"
    >
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        const buttonId = `map-filter-${category.id}`;
        const labelId = `map-filter-label-${category.id}`;

        return (
          <div key={category.id} className="group relative flex items-center">
            <button
              type="button"
              id={buttonId}
              name={`map-filter-${category.id}`}
              aria-pressed={isActive}
              aria-labelledby={labelId}
              onClick={() => setActiveCategory(category.id)}
              className={[
                'flex items-center justify-center rounded-full border border-white/20 p-3 shadow-lg backdrop-blur-md transition-all duration-300',
                isActive
                  ? 'bg-primary text-white scale-110 shadow-brand-500/50'
                  : 'bg-white/80 text-slate-600 shadow-black/10 hover:scale-105 hover:bg-white dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700',
              ].join(' ')}
            >
              <Icon size={24} className={isActive ? 'text-white' : 'text-brand-500 dark:text-brand-400'} />
            </button>

            <span
              id={labelId}
              className="absolute left-full ml-4 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity pointer-events-none group-hover:opacity-100 dark:bg-slate-700"
            >
              {category.label}
              <span className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-slate-800 dark:bg-slate-700" />
            </span>
          </div>
        );
      })}
    </div>
  );
}
