import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatPrice, calculateOriginalPrice } from '../../utils/formatters';
import useCartDrawer from '../../hooks/useCartDrawer';
import useToast from '../../hooks/useToast';
import useArtworksStore from '../../store/artworksStore';
import { HighlightedText } from '../../utils/highlightSearch';

const ArtworkCard = ({ artwork }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const searchTerm = useArtworksStore((state) => state.searchTerm);
  const isInCart = cartItems.some(item => item.id === artwork.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { openDrawer } = useCartDrawer();
  const toast = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart && artwork.available) {
      addToCart(artwork);
      toast.success(`"${artwork.title}" agregado al carrito`);
      setTimeout(() => {
        openDrawer();
      }, 300);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      <Link to={`/obra/${artwork.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-gallery-100">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gallery-200" />
          )}
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              artwork.available ? 'group-hover:scale-110' : ''
            } ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${
              !artwork.available ? 'filter grayscale-[30%]' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gallery-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                {artwork.technique}
              </p>
              <p className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-150">
                {artwork.dimensions}
              </p>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {!artwork.available && (
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: -15 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="bg-red-600 text-white rounded-lg px-4 py-2 shadow-lg transform -rotate-12"
              >
                <span className="text-sm font-black uppercase">VENDIDA</span>
              </motion.div>
            )}
            {artwork.discountPercentage > 0 && artwork.available && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="bg-red-500 text-white rounded-lg px-3 py-1 shadow-lg flex items-center gap-1"
              >
                <Tag className="h-3 w-3 flex-shrink-0" />
                <span className="text-sm font-bold whitespace-nowrap">{artwork.discountPercentage}% OFF</span>
              </motion.div>
            )}
            {artwork.available && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg w-10 h-10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-gallery-700" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <Link to={`/obra/${artwork.id}`}>
          <h3 className="text-base sm:text-lg font-serif font-semibold text-gallery-900 mb-3 line-clamp-2 hover:text-accent transition-colors">
            <HighlightedText text={artwork.title} searchTerm={searchTerm} />
          </h3>
        </Link>
        
        <div className="flex items-center justify-between gap-3 min-h-[60px] mt-auto">
          <div className="flex-1 min-w-0">
            {artwork.available ? (
              <div className="space-y-1">
                {artwork.discountPercentage > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">
                        {formatPrice(artwork.price, artwork.currency)}
                      </p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-red-100 text-red-800">
                        -{artwork.discountPercentage}%
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gallery-500 line-through">
                      {formatPrice(calculateOriginalPrice(artwork.price, artwork.discountPercentage), artwork.currency)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gallery-900">
                      {formatPrice(artwork.price, artwork.currency)}
                    </p>
                    <p className="text-xs sm:text-sm text-transparent select-none">-</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 uppercase">
                  ¡VENDIDA!
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Esta obra encontró su hogar
                </p>
              </div>
            )}
          </div>
          
          {artwork.available && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`group/btn relative overflow-hidden rounded-lg transition-all duration-300 flex-shrink-0 ${
                isInCart
                  ? 'bg-gallery-200 text-gallery-500 cursor-not-allowed px-3 sm:px-4 py-2'
                  : 'bg-gallery-900 text-white hover:bg-gallery-800 hover:shadow-md p-2.5 sm:p-3'
              }`}
              aria-label={isInCart ? 'Ya en el carrito' : 'Agregar al carrito'}
            >
              {isInCart ? (
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">En carrito</span>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover/btn:scale-110" />
                  <span className="absolute inset-0 bg-accent/20 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ArtworkCard;