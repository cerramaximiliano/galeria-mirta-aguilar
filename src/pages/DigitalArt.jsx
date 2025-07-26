import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Filter, Grid, List } from 'lucide-react';
import useDigitalArtStore from '../store/digitalArtStore';
import DigitalArtCard from '../components/DigitalArt/DigitalArtCard';
import ViewToggle from '../components/Gallery/ViewToggle';

const DigitalArt = () => {
  const { digitalArtworks, loading, fetchDigitalArtworks, isUsingMockData } = useDigitalArtStore();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory, setFilterCategory] = useState('all');
  
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
      {/* Header Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-10 w-10 text-purple-600" />
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gallery-900">
                Arte Digital
              </h1>
              <Palette className="h-10 w-10 text-pink-600" />
            </div>
            <p className="text-lg sm:text-xl text-gallery-600 max-w-3xl mx-auto mb-4">
              Reinterpretaciones digitales de obras clásicas, disponibles en formato de lámina premium.
              Perfectas para decorar espacios modernos con arte accesible y de calidad.
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

      {/* Info Banner */}
      <section className="py-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🖼️</div>
                <h3 className="font-bold text-lg mb-1">Múltiples Tamaños</h3>
                <p className="text-white/90 text-sm">A4, A3 y A2 disponibles</p>
              </div>
              <div>
                <div className="text-3xl mb-2">✨</div>
                <h3 className="font-bold text-lg mb-1">Calidad Premium</h3>
                <p className="text-white/90 text-sm">Papel fotográfico 250g</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-bold text-lg mb-1">Impresión Giclée</h3>
                <p className="text-white/90 text-sm">Máxima calidad y durabilidad</p>
              </div>
              <div>
                <div className="text-3xl mb-2">✍️</div>
                <h3 className="font-bold text-lg mb-1">Certificado</h3>
                <p className="text-white/90 text-sm">Autenticidad firmada</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and View Toggle */}
      <section className="py-6">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Category Filter */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Filter className="h-5 w-5 text-gallery-600" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
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
                {filteredArtworks.length} {filteredArtworks.length === 1 ? 'obra' : 'obras'} disponibles
              </div>

              {/* View Toggle */}
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 pb-20">
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

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-serif font-bold text-center mb-12">
              Preguntas Frecuentes
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gallery-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">
                  ¿Qué diferencia hay entre el arte digital y las obras originales?
                </h3>
                <p className="text-gallery-600">
                  El arte digital son reinterpretaciones de las obras originales, adaptadas 
                  para impresión en alta calidad. Mientras que las obras originales son piezas 
                  únicas pintadas a mano, las versiones digitales son reproducciones accesibles 
                  que mantienen la esencia artística.
                </p>
              </div>

              <div className="bg-gallery-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">
                  ¿Cuánto tiempo tarda la producción?
                </h3>
                <p className="text-gallery-600">
                  Las láminas se imprimen bajo demanda para garantizar la máxima calidad. 
                  El tiempo de producción es de 3-5 días hábiles, más el tiempo de envío 
                  según tu ubicación.
                </p>
              </div>

              <div className="bg-gallery-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">
                  ¿Las láminas vienen firmadas?
                </h3>
                <p className="text-gallery-600">
                  Sí, todas las láminas pueden incluir un certificado de autenticidad firmado 
                  por la artista. Esto se puede solicitar al momento de la compra sin costo adicional.
                </p>
              </div>

              <div className="bg-gallery-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">
                  ¿Qué tipo de papel se utiliza?
                </h3>
                <p className="text-gallery-600">
                  Utilizamos papel fotográfico premium de 250g con acabado mate o brillante 
                  según tu preferencia. La impresión es tipo giclée, que garantiza colores 
                  vibrantes y durabilidad a largo plazo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DigitalArt;