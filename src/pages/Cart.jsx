import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, getTotalPrice } = useCartStore();
  
  // Obtener la moneda predominante del carrito
  const cartCurrency = items.length > 0 ? items[0].currency || 'ARS' : 'ARS';

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container-custom py-16"
      >
        <div className="text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-6"
          >
            <div className="w-24 h-24 bg-gallery-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="h-12 w-12 text-gallery-400" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-serif font-bold text-gallery-900 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gallery-600 mb-8 text-lg">
            Agrega algunas obras de arte para continuar
          </p>
          <Link
            to="/"
            className="btn-primary"
          >
            Ver Galería
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container-custom py-8"
    >
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gallery-600 hover:text-gallery-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver</span>
      </button>

      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-serif font-bold text-gallery-900 mb-8"
      >
        Mi Carrito
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-soft p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.technique}</p>
                    <p className="text-sm text-gray-500">{item.dimensions}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(item.price, item.currency)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-red-500 hover:text-red-700 transition-colors p-1"
                      aria-label="Eliminar del carrito"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Resumen del pedido
            </h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatPrice(getTotalPrice(), cartCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">A coordinar</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(getTotalPrice(), cartCurrency)}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;