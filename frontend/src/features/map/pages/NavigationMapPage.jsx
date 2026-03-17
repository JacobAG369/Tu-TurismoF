import React from 'react';
import MainMap from '../components/MainMap';

export default function NavigationMapPage() {
  return (
    <div className="flex flex-1 min-h-[600px] h-[calc(100vh-70px)] overflow-hidden">
      <MainMap />
    </div>
  );
}
