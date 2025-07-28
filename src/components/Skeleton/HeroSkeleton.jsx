const HeroSkeleton = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-gray-100 animate-pulse">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container-custom">
          <div className="text-center space-y-6">
            {/* Title skeleton */}
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="h-12 bg-gray-300 rounded-lg w-3/4 mx-auto" />
              <div className="h-12 bg-gray-300 rounded-lg w-2/3 mx-auto" />
            </div>
            
            {/* Subtitle skeleton */}
            <div className="max-w-2xl mx-auto space-y-3 mt-8">
              <div className="h-6 bg-gray-300 rounded w-full" />
              <div className="h-6 bg-gray-300 rounded w-5/6 mx-auto" />
            </div>
            
            {/* Button skeleton */}
            <div className="mt-10">
              <div className="h-12 bg-gray-300 rounded-full w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation dots skeleton */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-2 h-2 bg-gray-400 rounded-full" />
        ))}
      </div>
    </section>
  );
};

export default HeroSkeleton;