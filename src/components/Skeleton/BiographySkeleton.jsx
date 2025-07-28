const BiographySkeleton = () => {
  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-white to-gray-50 animate-pulse">
      <div className="container-custom">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto" />
        </div>
        
        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile image */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
          </div>
          
          {/* Biography content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Introduction paragraphs */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            ))}
            
            {/* Milestones section */}
            <div className="pt-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-6 bg-gray-200 rounded w-16 flex-shrink-0" />
                    <div className="h-6 bg-gray-200 rounded flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiographySkeleton;