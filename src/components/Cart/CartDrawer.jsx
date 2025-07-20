import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../utils/formatters';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeFromCart, getTotalPrice } = useCartStore();
  const cartCurrency = items.length > 0 ? items[0].currency || 'ARS' : 'ARS';

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    },
    exit: { 
      x: '100%',
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gallery-200">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-gallery-700" />
                <h2 className="text-lg font-semibold text-gallery-900">
                  Mi Carrito ({items.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gallery-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gallery-600" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-gallery-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="h-10 w-10 text-gallery-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gallery-900 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gallery-600 mb-6">
                    Agrega algunas obras para continuar
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-primary btn-sm"
                  >
                    Explorar Galería
                  </button>
                </div>
              ) : (
                // Cart Items
                <div className="p-4 sm:p-6 space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex gap-4 p-3 bg-gallery-50 rounded-lg group"
                    >
                      {/* Image */}
                      <Link
                        to={`/obra/${item.id}`}
                        onClick={onClose}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.imageUrl || item.thumbnailUrl}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/obra/${item.id}`}
                          onClick={onClose}
                        >
                          <h4 className="font-medium text-gallery-900 line-clamp-1 hover:text-accent transition-colors">
                            {item.title}
                          </h4>
                        </Link>
                        <p className="text-sm text-gallery-600">
                          {item.artist}
                        </p>
                        <p className="text-sm font-semibold text-gallery-900 mt-1">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                      >
                        <Trash2 className="h-4 w-4 text-gallery-400 group-hover:text-red-600" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gallery-200 p-4 sm:p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gallery-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gallery-900">
                    {formatPrice(getTotalPrice(), cartCurrency)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    to="/carrito"
                    onClick={onClose}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Ir al Carrito
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={onClose}
                    className="btn-secondary w-full"
                  >
                    Seguir Comprando
                  </button>
                </div>

                {/* Shipping Note */}
                <p className="text-xs text-gallery-500 text-center">
                  Envío calculado en el siguiente paso
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;