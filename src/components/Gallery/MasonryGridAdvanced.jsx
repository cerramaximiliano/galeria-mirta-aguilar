import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtworkCardMasonry from './ArtworkCardMasonry';

const MasonryGridAdvanced = ({ artworks, showAnimation = true }) => {
  const [columns, setColumns] = useState(3);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Preload images to get actual dimensions
  useEffect(() => {
    const loadImages = async () => {
      const loadPromises = artworks.map((artwork) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded(prev => ({
              ...prev,
              [artwork.id]: {
                width: img.naturalWidth,
                height: img.naturalHeight,
                aspectRatio: img.naturalHeight / img.naturalWidth
              }
            }));
            resolve();
          };
          img.onerror = () => {
            // Default aspect ratio if image fails to load
            setImagesLoaded(prev => ({
              ...prev,
              [artwork.id]: { aspectRatio: 1.3 }
            }));
            resolve();
          };
          img.src = artwork.imageUrl || artwork.thumbnailUrl;
        });
      });

      await Promise.all(loadPromises);
      setIsLayoutReady(true);
    };

    if (artworks.length > 0) {
      loadImages();
    }
  }, [artworks]);

  // Calculate number of columns based on container width
  const calculateColumns = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    let cols = 3;
    
    if (containerWidth < 640) cols = 1;
    else if (containerWidth < 768) cols = 2;
    else if (containerWidth < 1024) cols = 3;
    else if (containerWidth < 1536) cols = 4;
    else cols = 5;
    
    setColumns(cols);
  }, []);

  useEffect(() => {
    calculateColumns();
    
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        calculateColumns();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, [calculateColumns]);

  // Distribute artworks into columns using bin packing algorithm
  const distributeArtworks = useCallback(() => {
    const cols = Array.from({ length: columns }, () => []);
    const heights = new Array(columns).fill(0);
    
    // Sort artworks by aspect ratio for better distribution
    const sortedArtworks = [...artworks].sort((a, b) => {
      const aspectA = imagesLoaded[a.id]?.aspectRatio || 1.3;
      const aspectB = imagesLoaded[b.id]?.aspectRatio || 1.3;
      return aspectB - aspectA;
    });
    
    sortedArtworks.forEach((artwork, index) => {
      // Find the column with minimum height
      const minHeightIndex = heights.indexOf(Math.min(...heights));
      
      // Add artwork to the shortest column
      cols[minHeightIndex].push({ 
        artwork, 
        originalIndex: artworks.findIndex(a => a.id === artwork.id)
      });
      
      // Calculate estimated height based on actual aspect ratio
      const aspectRatio = imagesLoaded[artwork.id]?.aspectRatio || 1.3;
      const estimatedHeight = 300 * aspectRatio; // Base width of 300px
      
      heights[minHeightIndex] += estimatedHeight + 24; // Add gap
    });
    
    return cols;
  }, [artworks, columns, imagesLoaded]);

  const columnizedArtworks = distributeArtworks();

  // Stagger animation for each column
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  if (!isLayoutReady) {
    // Show loading skeleton while images are loading
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className="animate-pulse"
          >
            <div className="bg-gallery-200 rounded-lg aspect-[4/5]"></div>
            <div className="mt-4 space-y-2">
              <div className="bg-gallery-200 h-4 w-3/4 rounded"></div>
              <div className="bg-gallery-200 h-3 w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      className="w-full"
      variants={containerVariants}
      initial={showAnimation ? "hidden" : "visible"}
      animate="visible"
    >
      <div className="flex gap-4 md:gap-6">
        <AnimatePresence mode="wait">
          {columnizedArtworks.map((column, columnIndex) => (
            <motion.div 
              key={`column-${columnIndex}-${columns}`}
              className="flex-1 flex flex-col gap-4 md:gap-6"
              variants={columnVariants}
            >
              {column.map(({ artwork, originalIndex }) => (
                <motion.div
                  key={artwork.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { 
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  className="transform-gpu"
                  layout
                  layoutId={`artwork-${artwork.id}`}
                >
                  <ArtworkCardMasonry artwork={artwork} />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MasonryGridAdvanced;