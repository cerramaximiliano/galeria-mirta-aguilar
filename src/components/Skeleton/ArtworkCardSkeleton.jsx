const ArtworkCardSkeleton = () => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-soft animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-[3/4] bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        
        {/* Artist */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        
        {/* Dimensions */}
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        
        {/* Price and button container */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
          
          {/* Button */}
          <div className="h-10 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </article>
  );
};

export default ArtworkCardSkeleton;