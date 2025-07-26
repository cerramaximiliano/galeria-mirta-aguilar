import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Palette } from 'lucide-react';
import useDigitalArtStore from '../../store/digitalArtStore';
import DigitalArtCard from './DigitalArtCard';

const DigitalArtSection = () => {
  const { digitalArtworks, loading, fetchDigitalArtworks, isUsingMockData } = useDigitalArtStore();

  useEffect(() => {
    fetchDigitalArtworks({ limit: 4 });
  }, [fetchDigitalArtworks]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!digitalArtworks.length) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gallery-900">
              Arte Digital
            </h2>
            <Palette className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-lg text-gallery-600 max-w-2xl mx-auto">
            Versiones reimaginadas de obras clásicas en formato digital. 
            Perfectas para espacios modernos y coleccionistas jóvenes.
          </p>
          
          {isUsingMockData() && (
            <p className="text-sm text-amber-600 mt-2 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
              Mostrando datos de ejemplo
            </p>
          )}
        </motion.div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 mb-12 text-white shadow-xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                🎨 Nueva Colección Digital
              </h3>
              <p className="text-white/90">
                Descubre reinterpretaciones modernas de obras maestras clásicas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="text-center sm:text-left">
                <p className="text-sm text-white/80">Impresión premium</p>
                <p className="font-bold">Calidad Giclée</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-white/80">Envío incluido</p>
                <p className="font-bold">A todo el país</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {digitalArtworks.slice(0, 4).map((artwork, index) => (
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
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/arte-digital"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Ver colección completa
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
        >
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🖼️</span>
            </div>
            <h4 className="font-semibold text-gallery-900 mb-2">Múltiples Tamaños</h4>
            <p className="text-sm text-gallery-600">
              Desde A4 hasta A2, adaptable a cualquier espacio
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h4 className="font-semibold text-gallery-900 mb-2">Calidad Premium</h4>
            <p className="text-sm text-gallery-600">
              Papel fotográfico 250g con impresión giclée
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✍️</span>
            </div>
            <h4 className="font-semibold text-gallery-900 mb-2">Firma Disponible</h4>
            <p className="text-sm text-gallery-600">
              Opción de certificado de autenticidad firmado
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalArtSection;