import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useArtworksStore from '../../store/artworksStore';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const setSearchFilter = useArtworksStore((state) => state.setSearchFilter);
  
  useEffect(() => {
    // Debounced search
    const timeoutId = setTimeout(() => {
      setSearchFilter(searchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, setSearchFilter]);
  
  const handleClear = () => {
    setSearchTerm('');
    setSearchFilter('');
  };
  
  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-2"
        initial={false}
        animate={{ width: isOpen ? 'auto' : '40px' }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gallery-600 hover:text-gallery-900 transition-colors"
          aria-label="Buscar obras"
        >
          <Search className="h-5 w-5" />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, artista o técnica..."
                className="w-64 px-4 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="ml-2 p-2 text-gallery-400 hover:text-gallery-600 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;