const ArtworkDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-16 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-10 bg-gray-200 rounded w-24 mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery skeleton */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-[4/5] bg-gray-200 rounded-lg" />
          
          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        
        {/* Product info skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
          
          {/* Price */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-8 bg-gray-200 rounded w-32" />
          </div>
          
          {/* Description sections */}
          <div className="space-y-4 py-6 border-t border-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <div className="h-12 bg-gray-200 rounded-lg flex-1" />
            <div className="h-12 bg-gray-200 rounded-lg w-12" />
          </div>
          
          {/* Additional info */}
          <div className="bg-gray-100 rounded-lg p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailSkeleton;