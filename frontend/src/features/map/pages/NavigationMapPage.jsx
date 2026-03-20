import { useEffect } from 'react';
import { useThemeStore } from '../../../store/useThemeStore';
import MainMap from '../components/MainMap';

export default function NavigationMapPage() {
  const resetMapTheme = useThemeStore((state) => state.resetMapTheme);

  // Reset map theme when leaving the page
  useEffect(() => {
    return () => {
      resetMapTheme();
    };
  }, [resetMapTheme]);

  return (
    <div className="flex flex-1 min-h-[600px] h-[calc(100vh-70px)] overflow-hidden">
      <MainMap />
    </div>
  );
}
