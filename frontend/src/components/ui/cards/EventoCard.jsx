import { Calendar, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const EventoCard = ({ 
  title, 
  image, 
  date, 
  location,
  category,
  className 
}) => {
  return (
    <div className={cn("bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group", className)}>
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {category && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary-500/90 text-white backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 mb-3">
          {title}
        </h3>

        <div className="mt-auto space-y-2">
          <div className="flex items-center text-slate-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center text-slate-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
