import {
  MapPin,
  Utensils,
  Calendar,
  Landmark,
  BedDouble,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: MapPin },
  { id: 'monumentos', label: 'Monumentos', icon: Landmark },
  { id: 'restaurantes', label: 'Restaurantes', icon: Utensils },
  { id: 'eventos', label: 'Eventos', icon: Calendar },
  { id: 'hoteles', label: 'Hoteles', icon: BedDouble },
];

export const getCategoryIcon = (categoryName) => {
  const norm = categoryName?.toLowerCase() || '';
  if (norm.includes('restaurante') || norm.includes('comida')) return Utensils;
  if (norm.includes('evento') || norm.includes('festival')) return Calendar;
  if (norm.includes('monumento') || norm.includes('historia')) return Landmark;
  if (norm.includes('hotel') || norm.includes('hospedaje')) return BedDouble;
  return MapPin;
};
