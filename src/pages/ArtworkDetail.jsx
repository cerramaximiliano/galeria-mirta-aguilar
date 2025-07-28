import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Tag } from 'lucide-react';
import useArtworksStore from '../store/artworksStore';
import useCartStore from '../store/cartStore';
import { motion } from 'framer-motion';
import { formatPrice, calculateOriginalPrice } from '../utils/formatters';
import ImageGalleryWithZoom from '../components/Gallery/ImageGalleryWithZoom';
import ArtworkDetailSkeleton from '../components/Skeleton/ArtworkDetailSkeleton';
import useCartDrawer from '../hooks/useCartDrawer';
import useToast from '../hooks/useToast';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artwork = useArtworksStore((state) => state.getArtworkById(id));
  const fetchArtworks = useArtworksStore((state) => state.fetchArtworks);
  const loading = useArtworksStore((state) => state.loading);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const artworks = useArtworksStore((state) => state.artworks);
  const { openDrawer } = useCartDrawer();
  const toast = useToast();
  
  useEffect(() => {
    // Always fetch artworks when accessing directly via URL
    // This ensures we have the latest data from MongoDB
    if (artworks.length === 0 || (!artwork && !loading)) {
      console.log(`🔍 ArtworkDetail: Fetching artworks for ID: ${id}`);
      fetchArtworks({ limit: 100 });
    }
  }, [id, artwork, loading, fetchArtworks, artworks.length]);
  
  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Only show "not found" after loading is complete
  if (!loading && !artwork) {
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
  
  // If still loading, show skeleton
  if (loading && !artwork) {
    return <ArtworkDetailSkeleton />;
  }
  
  // If not loading and no artwork, it doesn't exist
  if (!loading && !artwork) {
    return null;
  }

  const isInCart = cartItems.some(item => item.id === artwork.id);

  const handleAddToCart = () => {
    if (!isInCart && artwork.available) {
      addToCart(artwork);
      toast.success(`"${artwork.title}" agregado al carrito`);
      setTimeout(() => {
        openDrawer();
      }, 300);
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
          className="relative"
        >
          <ImageGalleryWithZoom 
            images={[
              {
                url: artwork.imageUrl,
                thumbnail: artwork.thumbnailUrl || artwork.imageUrl
              }
            ]}
            title={artwork.title}
          />
          {!artwork.available && (
            <div className="absolute top-8 right-8 z-10 pointer-events-none">
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