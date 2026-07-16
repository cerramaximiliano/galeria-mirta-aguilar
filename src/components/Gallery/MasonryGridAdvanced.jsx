import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtworkCardMasonry from './ArtworkCardMasonry';

// Las cards usan una relación de aspecto fija derivada del id (ver
// getAspectRatio en ArtworkCardMasonry), así que la distribución en columnas
// puede estimarse sin descargar ninguna imagen.
const ASPECT_RATIOS = [5 / 4, 4 / 3, 1, 6 / 5];

const getEstimatedAspectRatio = (artworkId) => {
  const hash = String(artworkId).split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return ASPECT_RATIOS[Math.abs(hash) % ASPECT_RATIOS.length];
};

const MasonryGridAdvanced = ({ artworks, showAnimation = true }) => {
  const [columns, setColumns] = useState(3);
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Calculate number of columns based on container width
  const calculateColumns = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    let cols = 3;
    
    // Better responsive breakpoints
    if (containerWidth < 480) cols = 1;      // Mobile portrait
    else if (containerWidth < 768) cols = 2;  // Mobile landscape / Tablet portrait
    else if (containerWidth < 1024) cols = 3; // Tablet landscape
    else if (containerWidth < 1280) cols = 4; // Desktop
    else cols = 4;                            // Large desktop (cap at 4 for better layout)
    
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

    artworks.forEach((artwork) => {
      // Find the column with minimum height
      const minHeightIndex = heights.indexOf(Math.min(...heights));

      // Add artwork to the shortest column
      cols[minHeightIndex].push({ artwork });

      // Calculate estimated height based on the card's fixed aspect ratio
      const aspectRatio = getEstimatedAspectRatio(artwork.id);
      const estimatedHeight = 300 * aspectRatio; // Base width of 300px

      heights[minHeightIndex] += estimatedHeight + 24; // Add gap
    });

    return cols;
  }, [artworks, columns]);

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

  return (
    <motion.div 
      ref={containerRef}
      className="w-full overflow-x-hidden"
      variants={containerVariants}
      initial={showAnimation ? "hidden" : "visible"}
      animate="visible"
    >
      {/* Single column for mobile */}
      {columns === 1 ? (
        <div className="space-y-4">
          {artworks.map((artwork) => (
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
            >
              <ArtworkCardMasonry artwork={artwork} />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Multi-column for larger screens */
        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <AnimatePresence mode="wait">
            {columnizedArtworks.map((column, columnIndex) => (
              <motion.div 
                key={`column-${columnIndex}-${columns}`}
                className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6"
                variants={columnVariants}
              >
              {column.map(({ artwork }) => (
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
      )}
    </motion.div>
  );
};

export default MasonryGridAdvanced;