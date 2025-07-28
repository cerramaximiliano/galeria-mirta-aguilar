const DigitalArtCardSkeleton = () => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-soft animate-pulse">
      {/* Badge skeleton */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="h-7 bg-gray-200 rounded-full w-24" />
        </div>
        
        {/* Image skeleton */}
        <div className="aspect-[3/4] bg-gray-200" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        
        {/* Artist */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        
        {/* Features */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-16" />
        </div>
        
        {/* Price and button container */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
          
          {/* Link */}
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </article>
  );
};

export default DigitalArtCardSkeleton;