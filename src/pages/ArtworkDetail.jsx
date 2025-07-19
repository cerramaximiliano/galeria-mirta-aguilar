import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Tag } from 'lucide-react';
import useArtworksStore from '../store/artworksStore';
import useCartStore from '../store/cartStore';
import { motion } from 'framer-motion';
import { formatPrice, calculateOriginalPrice } from '../utils/formatters';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artwork = useArtworksStore((state) => state.getArtworkById(id));
  const fetchArtworks = useArtworksStore((state) => state.fetchArtworks);
  const loading = useArtworksStore((state) => state.loading);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  
  useEffect(() => {
    if (!artwork && !loading) {
      fetchArtworks({ limit: 100 }); // Obtener hasta 100 obras
    }
  }, [artwork, loading, fetchArtworks]);
  
  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Obra no encontrada
        </h2>
        <button
          onClick={() => navigate('/')}
          className="text-accent hover:text-accent-dark transition-colors"
        >
          Volver a la galería
        </button>
      </div>
    );
  }

  const isInCart = cartItems.some(item => item.id === artwork.id);

  const handleAddToCart = () => {
    if (!isInCart && artwork.available) {
      addToCart(artwork);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gallery-600 hover:text-gallery-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="aspect-square rounded-lg overflow-hidden shadow-xl relative"
        >
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className={`w-full h-full object-cover ${!artwork.available ? 'filter grayscale-[30%]' : ''}`}
          />
          {!artwork.available && (
            <div className="absolute top-8 right-8">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: -15 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="bg-red-600 text-white rounded-lg px-6 py-3 shadow-2xl transform -rotate-12"
              >
                <span className="text-lg font-black uppercase">VENDIDA</span>
              </motion.div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {artwork.title}
          </h1>
          
          <div className="space-y-4 mb-8">
            <div>
              <span className="text-gray-600">Artista:</span>
              <p className="text-lg font-medium">{artwork.artist}</p>
            </div>
            
            <div>
              <span className="text-gray-600">Técnica:</span>
              <p className="text-lg">{artwork.technique}</p>
            </div>
            
            <div>
              <span className="text-gray-600">Dimensiones:</span>
              <p className="text-lg">{artwork.dimensions}</p>
            </div>
            
            <div>
              <span className="text-gray-600">Año:</span>
              <p className="text-lg">{artwork.year}</p>
            </div>
            
            <div>
              <span className="text-gray-600">Descripción:</span>
              <p className="text-gray-700 mt-2">{artwork.description}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                {artwork.discountPercentage > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-red-600">
                        {formatPrice(artwork.price, artwork.currency)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-red-500" />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
                          {artwork.discountPercentage}% OFF
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Precio original:</span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(calculateOriginalPrice(artwork.price, artwork.discountPercentage), artwork.currency)}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      ¡Ahorras {formatPrice(calculateOriginalPrice(artwork.price, artwork.discountPercentage) - artwork.price, artwork.currency)}!
                    </p>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(artwork.price, artwork.currency)}
                  </span>
                )}
              </div>
              {!artwork.available && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-red-50 border-2 border-red-200 rounded-lg px-6 py-3">
                    <div className="flex flex-col">
                      <span className="text-red-600 font-black text-xl uppercase tracking-wider">
                        ¡VENDIDA!
                      </span>
                      <span className="text-red-500 text-sm">
                        Esta obra ya encontró su hogar
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    ¿Te interesa una obra similar? <Link to="/contacto" className="text-accent hover:underline">Contáctanos</Link>
                  </p>
                </div>
              )}
            </div>

            {artwork.available && (
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`w-full ${
                  isInCart
                    ? 'btn-secondary opacity-50 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{isInCart ? 'Ya está en el carrito' : 'Agregar al carrito'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArtworkDetail;