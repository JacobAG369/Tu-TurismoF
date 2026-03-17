export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-slate-200" />
      
      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-slate-200 rounded-md w-1/3" />
          <div className="h-6 bg-slate-200 rounded-md w-1/4" />
        </div>
        
        <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-4" />
        
        <div className="mt-auto flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded-md w-1/4" />
          <div className="h-8 bg-slate-200 rounded-full w-1/4" />
        </div>
      </div>
    </div>
  );
};
