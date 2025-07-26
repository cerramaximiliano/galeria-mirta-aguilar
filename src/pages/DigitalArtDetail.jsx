import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart, Tag, Sparkles, Package, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useDigitalArtStore from '../store/digitalArtStore';
import useCartStore from '../store/cartStore';
import useCartDrawer from '../hooks/useCartDrawer';
import useToast from '../hooks/useToast';
import ImageGalleryWithZoom from '../components/Gallery/ImageGalleryWithZoom';
import { formatPrice } from '../utils/formatters';

const DigitalArtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    digitalArtworks, 
    fetchDigitalArtworks, 
    loading, 
    getDigitalArtworkById,
    setSelectedSize,
    getSelectedSize,
    getPriceForSize
  } = useDigitalArtStore();
  const { addToCart, items: cartItems } = useCartStore();
  const { openDrawer } = useCartDrawer();
  const toast = useToast();
  
  const artwork = getDigitalArtworkById(id);
  const [selectedSizeId, setLocalSelectedSize] = useState(null);
  
  useEffect(() => {
    if (digitalArtworks.length === 0 && !loading) {
      fetchDigitalArtworks();
    }
  }, [digitalArtworks.length, loading, fetchDigitalArtworks]);

  useEffect(() => {
    if (artwork && !selectedSizeId) {
      const defaultSizeId = getSelectedSize(artwork.id) || artwork.sizes.find(s => s.available)?.id;
      setLocalSelectedSize(defaultSizeId);
      setSelectedSize(artwork.id, defaultSizeId);
    }
  }, [artwork, selectedSizeId, getSelectedSize, setSelectedSize]);

  const handleSizeChange = (sizeId) => {
    setLocalSelectedSize(sizeId);
    setSelectedSize(artwork.id, sizeId);
  };

  const selectedSizeData = getPriceForSize(artwork?.id, selectedSizeId);
  
  const isInCart = cartItems.some(item => 
    item.id === `${artwork?.id}-${selectedSizeId}` || 
    (item.digitalArtId === artwork?.id && item.sizeId === selectedSizeId)
  );

  const handleAddToCart = () => {
    if (!isInCart && artwork && selectedSizeData) {
      const cartItem = {
        id: `${artwork.id}-${selectedSizeId}`,
        digitalArtId: artwork.id,
        title: `${artwork.title} - ${selectedSizeData.size}`,
        artist: artwork.artist,
        price: selectedSizeData.price,
        currency: selectedSizeData.currency,
        imageUrl: artwork.thumbnailUrl || artwork.imageUrl,
        type: 'digital',
        size: selectedSizeData.size,
        sizeId: selectedSizeId,
        dimensions: selectedSizeData.dimensions,
        features: artwork.features
      };
      
      addToCart(cartItem);
      toast.success(`"${artwork.title}" agregado al carrito`);
      setTimeout(() => {
        openDrawer();
      }, 300);
    }
  };

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

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Obra digital no encontrada
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
        {/* Image Gallery */}
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Sparkles className="h-4 w-4" />
              Arte Digital
            </div>
          </div>
          
          <ImageGalleryWithZoom 
            images={[
              {
                url: artwork.imageUrl,
                thumbnail: artwork.thumbnailUrl || artwork.imageUrl
              }
            ]}
            title={artwork.title}
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {artwork.title}
          </h1>
          <p className="text-lg text-gallery-600 mb-4">
            Basado en: "{artwork.originalTitle}"
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
              <span className="text-gray-600">Artista:</span>
              <p className="text-lg font-medium">{artwork.artist}</p>
            </div>
            
            <div>
              <span className="text-gray-600">Técnica digital:</span>
              <p className="text-lg">{artwork.digitalTechnique}</p>
            </div>
            
            <div>
              <span className="text-gray-600">Descripción:</span>
              <p className="text-gray-700 mt-2">{artwork.description}</p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Selecciona el tamaño:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {artwork.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSizeChange(size.id)}
                  disabled={!size.available}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${selectedSizeId === size.id 
                      ? 'border-accent bg-accent/5' 
                      : 'border-gallery-200 hover:border-gallery-300'
                    }
                    ${!size.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="text-sm font-medium text-gallery-900">{size.size}</div>
                  <div className="text-xs text-gallery-600">{size.dimensions}</div>
                  <div className="text-lg font-bold text-gallery-900 mt-2">
                    {formatPrice(size.price, size.currency)}
                  </div>
                  {!size.available && (
                    <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gallery-600">No disponible</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gallery-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gallery-900 mb-3">Características:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Papel:</span> {artwork.features.paperType}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Impresión:</span> {artwork.features.printing}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Edición:</span> {artwork.features.edition}
                </div>
              </li>
              {artwork.features.signedAvailable && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Certificado de autenticidad firmado disponible</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Price and Add to Cart */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gallery-600">Precio</p>
                <p className="text-3xl font-bold text-gallery-900">
                  {selectedSizeData && formatPrice(selectedSizeData.price, selectedSizeData.currency)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gallery-600">
                <Package className="h-4 w-4" />
                <span>Envío calculado al finalizar</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isInCart || !selectedSizeData?.available}
              className={`w-full ${
                isInCart
                  ? 'btn-secondary opacity-50 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{isInCart ? 'Ya está en el carrito' : 'Agregar al carrito'}</span>
            </button>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Nota:</strong> Las láminas se imprimen bajo demanda para garantizar 
                la máxima calidad. El tiempo de producción es de 3-5 días hábiles.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <h3 className="text-2xl font-serif font-bold text-gallery-900 mb-4">
          ¿Te interesa la obra original?
        </h3>
        <p className="text-gallery-600 mb-6">
          Esta es una reinterpretación digital de una obra original de la artista
        </p>
        <Link
          to={`/obra/${artwork.originalArtworkId}`}
          className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-medium"
        >
          Ver obra original
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default DigitalArtDetail;