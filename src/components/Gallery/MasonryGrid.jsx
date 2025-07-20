import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';

const MasonryGrid = ({ artworks }) => {
  const [columns, setColumns] = useState(3);
  const containerRef = useRef(null);

  // Calculate number of columns based on container width
  useEffect(() => {
    const calculateColumns = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      let cols = 3; // Default for desktop
      
      if (containerWidth < 640) cols = 1; // Mobile
      else if (containerWidth < 1024) cols = 2; // Tablet
      else if (containerWidth < 1280) cols = 3; // Desktop
      else cols = 4; // Large desktop
      
      setColumns(cols);
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    return () => window.removeEventListener('resize', calculateColumns);
  }, []);

  // Distribute artworks into columns
  const distributeArtworks = () => {
    const cols = Array.from({ length: columns }, () => []);
    const heights = new Array(columns).fill(0);
    
    artworks.forEach((artwork, index) => {
      // Find the column with minimum height
      const minHeightIndex = heights.indexOf(Math.min(...heights));
      cols[minHeightIndex].push({ artwork, index });
      
      // Estimate height based on aspect ratio (you can adjust these values)
      const estimatedHeight = artwork.dimensions ? 
        (artwork.dimensions.includes('x') ? 
          parseInt(artwork.dimensions.split('x')[0]) / parseInt(artwork.dimensions.split('x')[1]) * 300 : 350
        ) : 350;
      
      heights[minHeightIndex] += estimatedHeight + 20; // Add gap
    });
    
    return cols;
  };

  const columnizedArtworks = distributeArtworks();

  return (
    <div 
      ref={containerRef}
      className="w-full"
    >
      <div className="flex gap-4 md:gap-6">
        {columnizedArtworks.map((column, columnIndex) => (
          <div 
            key={columnIndex} 
            className="flex-1 flex flex-col gap-4 md:gap-6"
          >
            {column.map(({ artwork, index }) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="transform-gpu"
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;