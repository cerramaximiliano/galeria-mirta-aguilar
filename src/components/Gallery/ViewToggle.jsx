import { LayoutGrid, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const ViewToggle = ({ view, setView }) => {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-soft">
      <button
        onClick={() => setView('grid')}
        className={`relative px-3 py-2 rounded-md transition-colors duration-200 ${
          view === 'grid' 
            ? 'text-gallery-900' 
            : 'text-gallery-500 hover:text-gallery-700'
        }`}
        title="Vista de cuadrícula"
      >
        {view === 'grid' && (
          <motion.div
            layoutId="viewToggleBackground"
            className="absolute inset-0 bg-gallery-100 rounded-md"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35
            }}
          />
        )}
        <LayoutGrid className="h-5 w-5 relative z-10" />
      </button>
      
      <button
        onClick={() => setView('masonry')}
        className={`relative px-3 py-2 rounded-md transition-colors duration-200 ${
          view === 'masonry' 
            ? 'text-gallery-900' 
            : 'text-gallery-500 hover:text-gallery-700'
        }`}
        title="Vista masonry"
      >
        {view === 'masonry' && (
          <motion.div
            layoutId="viewToggleBackground"
            className="absolute inset-0 bg-gallery-100 rounded-md"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35
            }}
          />
        )}
        <Layers className="h-5 w-5 relative z-10" />
      </button>
    </div>
  );
};

export default ViewToggle;