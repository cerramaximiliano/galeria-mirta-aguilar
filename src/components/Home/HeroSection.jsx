import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useArtworksStore from '../../store/artworksStore';
import HeroSkeleton from '../Skeleton/HeroSkeleton';

const HeroSection = () => {
  const artworks = useArtworksStore((state) => state.artworks);
  const loading = useArtworksStore((state) => state.loading);
  
  console.log('🖼️ HeroSection: Renderizando');
  console.log(`📊 Total de obras en el store: ${artworks.length}`);
  console.log(`⏳ Loading: ${loading}`);
  
  // Filtrar obras destacadas
  const featuredArtworks = artworks.filter(artwork => artwork.featured === true);
  console.log(`🌟 Obras destacadas encontradas: ${featuredArtworks.length}`);
  
  // Si no hay obras destacadas, usar las primeras 5 como fallback
  const displayArtworks = featuredArtworks.length > 0 ? featuredArtworks : artworks.slice(0, 5);
  if (featuredArtworks.length === 0) {
    console.log('⚠️ No se encontraron obras destacadas, usando las primeras 5 obras como fallback');
  }
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayArtworks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayArtworks.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayArtworks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? displayArtworks.length - 1 : prev - 1
    );
  };

  if (loading || displayArtworks.length === 0) {
    return <HeroSkeleton />;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gallery-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <img
              src={displayArtworks[currentIndex]?.imageUrl}
              alt={displayArtworks[currentIndex]?.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gallery-900/80 via-gallery-900/40 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl"
          >
            <h2 className="mb-6 text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              Arte que
              <span className="block text-accent">
                Transforma Espacios
              </span>
            </h2>
            <p className="mb-8 text-lg md:text-xl text-gallery-100 leading-relaxed">
              Descubre la colección exclusiva de Mirta Aguilar, 
              donde cada obra cuenta una historia única y transforma 
              cualquier ambiente en una galería personal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="#galeria"
                className="btn-primary inline-flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('galeria');
                  if (element) {
                    // Different header offset for mobile and desktop
                    const headerOffset = window.innerWidth < 640 ? 60 : 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                Explorar Colección
              </Link>
              <Link
                to="/arte-digital"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span>✨</span> Arte Digital
              </Link>
              <Link
                to="/biografia"
                className="btn-secondary bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              >
                Conocer a la Artista
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Anterior obra"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Siguiente obra"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {displayArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-accent' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Ir a obra ${index + 1}`}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/60"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;