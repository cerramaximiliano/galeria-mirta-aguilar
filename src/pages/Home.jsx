import { useEffect, useState } from 'react';
import useArtworksStore from '../store/artworksStore';
import ArtworkCard from '../components/Gallery/ArtworkCard';
import FilterBar from '../components/Gallery/FilterBar';
import HeroSection from '../components/Home/HeroSection';
import MasonryGridAdvanced from '../components/Gallery/MasonryGridAdvanced';
import ViewToggle from '../components/Gallery/ViewToggle';
import DigitalArtSection from '../components/DigitalArt/DigitalArtSection';
import ArtworkCardSkeleton from '../components/Skeleton/ArtworkCardSkeleton';
import HeroSkeleton from '../components/Skeleton/HeroSkeleton';
import { motion } from 'framer-motion';

const Home = () => {
  const { filteredArtworks, fetchArtworks, loading, artworks, searchTerm, selectedCategory } = useArtworksStore();
  const [viewMode, setViewMode] = useState('masonry'); // 'grid' or 'masonry'
  
  useEffect(() => {
    fetchArtworks({ limit: 100 }); // Obtener hasta 100 obras
  }, [fetchArtworks]);

  return (
    <>
      <HeroSection />
      
      <section id="galeria" className="pt-4 pb-8 sm:py-12 md:py-20 bg-white overflow-x-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4 sm:mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-2 sm:mb-4">
              Colección Completa
            </h2>
            <p className="hidden sm:block text-base sm:text-lg text-gallery-600 max-w-2xl mx-auto px-4 sm:px-0 mb-4">
              Explora nuestra cuidadosa selección de obras que capturan la esencia 
              del arte contemporáneo con un toque personal único
            </p>
            <div className="flex justify-center items-center gap-4">
              <ViewToggle view={viewMode} setView={setViewMode} />
            </div>
          </motion.div>
          
          <FilterBar />
          
          {/* Search and filter results info */}
          {(searchTerm || selectedCategory !== 'todos') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-center"
            >
              <p className="text-sm text-gallery-600">
                {filteredArtworks.length === 0 ? 'No se encontraron' : `Se encontraron ${filteredArtworks.length}`} obras
                {searchTerm && ` que coinciden con "${searchTerm}"`}
                {selectedCategory !== 'todos' && ` en la categoría "${selectedCategory}"`}
              </p>
            </motion.div>
          )}
          
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'masonry' ? '' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'}
            >
              {viewMode === 'masonry' ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 lg:gap-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="mb-4 sm:mb-6 lg:mb-8 break-inside-avoid">
                      <ArtworkCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ArtworkCardSkeleton key={i} />
                ))
              )}
            </motion.div>
          ) : filteredArtworks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gallery-500 text-lg">
                No se encontraron obras con los criterios seleccionados.
              </p>
            </motion.div>
          ) : viewMode === 'masonry' ? (
            <MasonryGridAdvanced 
              artworks={filteredArtworks} 
              showAnimation={true}
            />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <ArtworkCard artwork={artwork} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Digital Art Section */}
      <DigitalArtSection />

      <section className="py-12 sm:py-16 md:py-20 bg-gallery-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto px-4 sm:px-0"
          >
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Arte que Inspira
            </h3>
            <p className="text-lg text-gallery-600 mb-8">
              Cada obra es una ventana a un mundo de emociones y experiencias. 
              Encuentra la pieza perfecta que resuene con tu espacio y tu alma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/biografia"
                className="btn-primary inline-flex items-center justify-center"
              >
                Conocer a la Artista
              </a>
              <a
                href="/contacto"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Contactar
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;