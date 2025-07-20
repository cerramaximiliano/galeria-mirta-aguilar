import { Search, X } from 'lucide-react';
import useArtworksStore from '../../store/artworksStore';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { value: 'todos', label: 'Todas las Obras' },
  { value: 'abstracto', label: 'Abstracto' },
  { value: 'paisaje', label: 'Paisajes' },
  { value: 'retrato', label: 'Retratos' },
  { value: 'naturaleza', label: 'Naturaleza' },
  { value: 'otros', label: 'Otros' }
];

const FilterBar = () => {
  const { selectedCategory, searchTerm, setSelectedCategory, setSearchTerm, artworks } = useArtworksStore();

  const getCategoryCount = (category) => {
    if (category === 'todos') return artworks.length;
    return artworks.filter(artwork => artwork.category === category).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4 sm:mb-8 md:mb-12"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-soft p-3 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gallery-400 h-4 sm:h-5 w-4 sm:w-5 transition-colors group-focus-within:text-gallery-600" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-12 pr-8 sm:pr-12 py-2 sm:py-3 bg-gallery-50 border border-gallery-200 rounded-lg sm:rounded-xl 
                         text-sm sm:text-base text-gallery-700 placeholder-gallery-400
                         focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                         transition-all duration-300"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 
                             text-gallery-400 hover:text-gallery-600 transition-colors p-1"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 sm:h-5 w-4 sm:w-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex gap-1.5 sm:gap-3 flex-wrap justify-center lg:justify-end">
            {categories.map((category, index) => {
              const count = getCategoryCount(category.value);
              const isActive = selectedCategory === category.value;
              // On mobile, show only "Todas", "Abstracto", "Paisaje" and "Retrato" initially
              const showOnMobile = index < 4 || isActive;
              
              return (
                <motion.button
                  key={category.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`relative px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gallery-900 text-white shadow-lg'
                      : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200 hover:text-gallery-900'
                  } ${!showOnMobile ? 'hidden sm:block' : ''}`}
                >
                  <span className="sm:hidden">{category.value === 'todos' ? 'Todas' : category.label.split(' ')[0]}</span>
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className={`ml-1 sm:ml-2 text-[10px] sm:text-sm ${
                    isActive ? 'text-white/70' : 'text-gallery-400'
                  }`}>
                    {count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gallery-900 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;