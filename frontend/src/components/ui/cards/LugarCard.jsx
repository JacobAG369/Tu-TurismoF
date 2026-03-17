import { Star, Clock, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const LugarCard = ({ 
  title, 
  image, 
  category, 
  rating = 0, 
  duration, 
  location,
  className 
}) => {
  return (
    <div className={cn("bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group", className)}>
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8'} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {category && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">
            {title}
          </h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {location && (
          <div className="flex items-center text-slate-500 text-sm mb-4">
            <MapPin className="w-4 h-4 mr-1 text-slate-400" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center text-slate-600 text-sm font-medium">
            <Clock className="w-4 h-4 mr-1.5 text-primary-500" />
            {duration || '2-3 horas'}
          </div>
          <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-full transition-colors duration-200">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};
