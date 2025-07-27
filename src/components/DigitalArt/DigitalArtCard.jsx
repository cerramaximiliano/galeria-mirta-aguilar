import { Link } from 'react-router-dom';
import { Palette, Sparkles, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatPrice } from '../../utils/formatters';

const DigitalArtCard = ({ artwork }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Debug
  console.log('DigitalArtCard - artwork:', artwork);
  console.log('DigitalArtCard - ID will be:', artwork._id || artwork.id);

  // Get the minimum price from available sizes
  const minPrice = Math.min(...artwork.sizes.filter(s => s.available).map(s => s.price));
  const currency = artwork.sizes[0]?.currency || 'ARS';

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/arte-digital/${artwork._id || artwork.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gallery-100">
          {/* Badge for digital art */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Sparkles className="h-3.5 w-3.5" />
              Arte Digital
            </div>
          </div>

          {/* Image */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-gallery-200" />
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gallery-100">
              <Palette className="h-12 w-12 text-gallery-400" />
            </div>
          ) : (
            <img
              src={artwork.thumbnailUrl || artwork.imageUrl}
              alt={artwork.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gallery-900/70 via-gallery-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                {artwork.digitalTechnique}
              </p>
              <p className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-150">
                Basado en: "{artwork.originalTitle}"
              </p>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-gallery-900 mb-1 line-clamp-2">
          {artwork.title}
        </h3>
        <p className="text-sm text-gallery-600 mb-3">{artwork.artist}</p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          {artwork.features.signedAvailable && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
              <Tag className="h-3 w-3" />
              Firma disponible
            </span>
          )}
          <span className="inline-flex items-center px-2 py-1 bg-gallery-100 text-gallery-700 rounded-full text-xs">
            {artwork.sizes.length} tamaños
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gallery-500">Desde</p>
            <p className="text-lg font-bold text-gallery-900">
              {formatPrice(minPrice, currency)}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
          >
            Ver detalles →
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default DigitalArtCard;