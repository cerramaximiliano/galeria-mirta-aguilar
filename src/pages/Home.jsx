import { useEffect } from 'react';
import useArtworksStore from '../store/artworksStore';
import ArtworkCard from '../components/Gallery/ArtworkCard';
import FilterBar from '../components/Gallery/FilterBar';
import HeroSection from '../components/Home/HeroSection';
import SoldCounter from '../components/Gallery/SoldCounter';
import { motion } from 'framer-motion';

const Home = () => {
  const { filteredArtworks, fetchArtworks, loading, artworks } = useArtworksStore();
  const soldCount = artworks.filter(a => !a.available).length;
  
  useEffect(() => {
    fetchArtworks({ limit: 100 }); // Obtener hasta 100 obras
  }, [fetchArtworks]);

  return (
    <>
      <HeroSection />
      
      <section id="galeria" className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Colección Completa
            </h2>
            <p className="text-lg text-gallery-600 max-w-2xl mx-auto">
              Explora nuestra cuidadosa selección de obras que capturan la esencia 
              del arte contemporáneo con un toque personal único
            </p>
          </motion.div>
          
          <FilterBar />
          
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gallery-900"></div>
                <p className="ml-3 text-gallery-500 text-lg">Cargando obras...</p>
              </div>
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
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
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

      <section className="py-20 bg-gallery-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
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