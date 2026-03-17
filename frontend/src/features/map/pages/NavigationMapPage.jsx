import React from 'react';
import MainMap from '../components/MainMap';

export default function NavigationMapPage() {
  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-64px)] overflow-hidden">
      <MainMap />
    </div>
  );
}
