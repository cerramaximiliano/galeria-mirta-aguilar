import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatPrice, calculateOriginalPrice } from '../../utils/formatters';

const ArtworkCardMasonry = ({ artwork }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const isInCart = cartItems.some(item => item.id === artwork.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart && artwork.available) {
      addToCart(artwork);
    }
  };

  // Calculate a random but consistent height for masonry effect
  const getAspectRatio = () => {
    // Use artwork ID to generate consistent aspect ratio
    const hash = artwork.id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const ratios = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[5/6]'];
    return ratios[Math.abs(hash) % ratios.length];
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 w-full"
    >
      <Link to={`/obra/${artwork.id}`} className="block">
        <div className={`relative ${getAspectRatio()} overflow-hidden bg-gallery-100`}>
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-gallery-200" />
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gallery-100">
              <Eye className="h-12 w-12 text-gallery-400" />
            </div>
          ) : (
            <img
              src={artwork.imageUrl || artwork.thumbnailUrl}
              alt={artwork.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-700 ${
                artwork.available ? 'group-hover:scale-110' : ''
              } ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${
                !artwork.available ? 'filter grayscale-[30%]' : ''
              }`}
            />
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gallery-900/70 via-gallery-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100 line-clamp-1">
                {artwork.technique}
              </p>
              <p className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-150 line-clamp-1">
                {artwork.dimensions} • {artwork.year}
              </p>
            </div>
          </div>
          
          {/* Quick view button */}
          <button 
            className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
            title="Ver detalles"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gallery-700" />
          </button>
          
          {/* Status badges */}
          {!artwork.available && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: -15 }}
                className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-bold shadow-lg transform -rotate-12"
              >
                VENDIDA
              </motion.div>
            </div>
          )}
          
          {artwork.discountPercentage > 0 && artwork.available && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {artwork.discountPercentage}% OFF
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-serif text-base sm:text-lg font-semibold text-gallery-900 mb-1 line-clamp-2">
          {artwork.title}
        </h3>
        <p className="text-xs sm:text-sm text-gallery-600 mb-2 sm:mb-3">{artwork.artist}</p>
        
        {/* Price and cart */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            {artwork.discountPercentage > 0 ? (
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm sm:text-lg font-bold text-red-600">
                    {formatPrice(artwork.price, artwork.currency)}
                  </span>
                  <span className="text-xs sm:text-sm text-gallery-500 line-through">
                    {formatPrice(calculateOriginalPrice(artwork.price, artwork.discountPercentage), artwork.currency)}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-gallery-900">
                {formatPrice(artwork.price, artwork.currency)}
              </span>
            )}
          </div>
          
          {artwork.available && (
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 ${
                isInCart
                  ? 'bg-gallery-200 text-gallery-500 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent-dark hover:scale-110 active:scale-95'
              }`}
              title={isInCart ? 'Ya en el carrito' : 'Agregar al carrito'}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ArtworkCardMasonry;