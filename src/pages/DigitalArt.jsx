import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Filter, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import useDigitalArtStore from '../store/digitalArtStore';
import DigitalArtCard from '../components/DigitalArt/DigitalArtCard';
import ViewToggle from '../components/Gallery/ViewToggle';

const DigitalArt = () => {
  const { digitalArtworks, loading, fetchDigitalArtworks, isUsingMockData } = useDigitalArtStore();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFAQ, setShowFAQ] = useState(false);
  
  useEffect(() => {
    fetchDigitalArtworks({ limit: 100 });
  }, [fetchDigitalArtworks]);

  // Filter artworks based on category
  const filteredArtworks = filterCategory === 'all' 
    ? digitalArtworks 
    : digitalArtworks.filter(art => art.tags?.includes(filterCategory));

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'reinterpretación', label: 'Reinterpretaciones' },
    { value: 'moderno', label: 'Moderno' },
    { value: 'decorativo', label: 'Decorativo' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="container-custom py-20">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 rounded-xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header Section - Reduced padding */}
      <section className="pt-20 pb-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gallery-900">
                Arte Digital
              </h1>
              <Palette className="h-8 w-8 text-pink-600" />
            </div>
            <p className="text-base sm:text-lg text-gallery-600 max-w-2xl mx-auto">
              Reinterpretaciones digitales en láminas premium
            </p>
            
            {isUsingMockData() && (
              <p className="text-sm text-amber-600 mt-2 flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
                Mostrando datos de ejemplo
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Combined Info Bar and Filters */}
      <section className="py-4">
        <div className="container-custom">
          {/* Compact info bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-3 text-white shadow-lg mb-4"
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span>🖼️</span>
                <span className="font-medium">A4, A3, A2</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="font-medium">Papel Premium 250g</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎨</span>
                <span className="font-medium">Impresión Giclée</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✍️</span>
                <span className="font-medium">Certificado incluido</span>
              </div>
            </div>
          </motion.div>

          {/* Simplified filters */}
          <div className="bg-white rounded-lg shadow-soft p-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gallery-600" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-sm px-3 py-1.5 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results count */}
              <div className="text-sm text-gallery-600">
                {filteredArtworks.length} {filteredArtworks.length === 1 ? 'obra' : 'obras'}
              </div>

              {/* View Toggle */}
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-4 pb-12">
        <div className="container-custom">
          {filteredArtworks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Palette className="h-16 w-16 text-gallery-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gallery-600 mb-2">
                No se encontraron obras digitales
              </h3>
              <p className="text-gallery-500">
                Intenta con otro filtro o vuelve más tarde
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}
            >
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DigitalArtCard artwork={artwork} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section - Collapsible */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            {/* FAQ Toggle Button */}
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className="w-full bg-gallery-50 hover:bg-gallery-100 rounded-lg p-4 flex items-center justify-between transition-colors"
            >
              <h2 className="text-lg font-serif font-bold text-gallery-900">
                Preguntas Frecuentes
              </h2>
              {showFAQ ? (
                <ChevronUp className="h-5 w-5 text-gallery-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gallery-600" />
              )}
            </button>
            
            {/* FAQ Content */}
            {showFAQ && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                <div className="bg-gallery-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    ¿Qué diferencia hay entre el arte digital y las obras originales?
                  </h3>
                  <p className="text-sm text-gallery-600">
                    El arte digital son reinterpretaciones de las obras originales, adaptadas 
                    para impresión en alta calidad. Mientras que las obras originales son piezas 
                    únicas pintadas a mano, las versiones digitales son reproducciones accesibles 
                    que mantienen la esencia artística.
                  </p>
                </div>

                <div className="bg-gallery-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    ¿Cuánto tiempo tarda la producción?
                  </h3>
                  <p className="text-sm text-gallery-600">
                    Las láminas se imprimen bajo demanda para garantizar la máxima calidad. 
                    El tiempo de producción es de 3-5 días hábiles, más el tiempo de envío 
                    según tu ubicación.
                  </p>
                </div>

                <div className="bg-gallery-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    ¿Las láminas vienen firmadas?
                  </h3>
                  <p className="text-sm text-gallery-600">
                    Sí, todas las láminas pueden incluir un certificado de autenticidad firmado 
                    por la artista. Esto se puede solicitar al momento de la compra sin costo adicional.
                  </p>
                </div>

                <div className="bg-gallery-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    ¿Qué tipo de papel se utiliza?
                  </h3>
                  <p className="text-sm text-gallery-600">
                    Utilizamos papel fotográfico premium de 250g con acabado mate o brillante 
                    según tu preferencia. La impresión es tipo giclée, que garantiza colores 
                    vibrantes y durabilidad a largo plazo.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DigitalArt;