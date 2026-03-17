import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';

import { useThemeStore } from '../../../store/useThemeStore';
import { mapApi } from '../../../api/map';
import { useMapStore } from '../../../store/useMapStore';
import MapFilters from './MapFilters';
import { getCategoryIcon } from '../utils/icons';
import PlaceDetailCard from './PlaceDetailCard';

const LightTiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const DarkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Subcomponent to automatically fly to a location or fit bounds
function MapUpdater({ markers, selectedCategory }) {
  const map = useMap();
  
  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [
        m.ubicacion?.coordinates[1] || 0, // lat
        m.ubicacion?.coordinates[0] || 0 // lng
      ]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [markers, map, selectedCategory]);

  return null;
}

export default function MainMap() {
  const theme = useThemeStore((state) => state.theme);
  const { activeCategory, setActiveCategory, selectedMarkerId, setSelectedMarkerId } = useMapStore();

  const { data: markers = [], isLoading, error } = useQuery({
    queryKey: ['map-markers', activeCategory],
    queryFn: () => mapApi.getMarkers(activeCategory !== 'all' ? activeCategory : null),
  });

  const selectedMarker = useMemo(() => {
    return markers.find(m => m.id === selectedMarkerId);
  }, [markers, selectedMarkerId]);

  // Center defaults to somewhere, e.g., Mexico City or a generic location
  const defaultCenter = [19.4326, -99.1332];

  return (
    <div className="relative w-full h-full flex-1 min-h-[600px] z-0 bg-slate-100 dark:bg-slate-900">
      
      {isLoading && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-red-100 text-red-600 px-4 py-2 rounded-lg shadow-md font-medium text-sm">
          Error al cargar marcadores. Intente nuevamente.
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={13}
        zoomControl={false}
        className="w-full h-full min-h-[600px] z-0 font-sans"
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={theme === 'dark' ? DarkTiles : LightTiles}
        />
        
        {markers.map((marker) => {
          if (!marker.ubicacion || !marker.ubicacion.coordinates) return null;
          const [lng, lat] = marker.ubicacion.coordinates;
          const IconComponent = getCategoryIcon(marker.categoria?.nombre || marker.tipo);
          
          // Re-create the divIcon HTML string directly
          const iconHtml = `<div class="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 shadow-brand-500/40 transition-transform hover:scale-110">
            ${renderToString(<IconComponent size={20} />)}
          </div>`;

          const divIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-leaflet-icon-container bg-transparent border-none',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          return (
            <Marker
              key={marker.id}
              position={[lat, lng]}
              icon={divIcon}
              eventHandlers={{
                click: () => setSelectedMarkerId(marker.id),
              }}
            />
          );
        })}

        <MapUpdater markers={markers} selectedCategory={activeCategory} />
      </MapContainer>

      {/* Floating UI */}
      <MapFilters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      
      <PlaceDetailCard marker={selectedMarker} onClose={() => setSelectedMarkerId(null)} />
    </div>
  );
}
