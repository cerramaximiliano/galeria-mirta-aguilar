import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCartStore();
  
  // Obtener parámetros de MercadoPago
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const merchantOrderId = searchParams.get('merchant_order_id');

  useEffect(() => {
    // Limpiar el carrito al completar la compra
    clearCart();
    
    // Lanzar confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);

    return () => clearInterval(interval);
  }, [clearCart]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-gallery-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 25,
              delay: 0.3 
            }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-serif font-bold text-gallery-900 mb-3">
            ¡Pago exitoso!
          </h1>
          
          <p className="text-gallery-600 mb-8">
            Tu compra ha sido procesada correctamente.
            Pronto recibirás un email con todos los detalles.
          </p>

          {/* Order Info */}
          <div className="bg-gallery-50 rounded-lg p-4 mb-8 text-left">
            <div className="space-y-2 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gallery-600">ID de Pago:</span>
                  <span className="font-medium text-gallery-900">{paymentId}</span>
                </div>
              )}
              {merchantOrderId && (
                <div className="flex justify-between">
                  <span className="text-gallery-600">Orden:</span>
                  <span className="font-medium text-gallery-900">#{merchantOrderId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-gallery-900">Revisa tu email</h3>
                <p className="text-sm text-gallery-600">
                  Te enviamos la confirmación con los detalles de tu compra
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-gallery-900">Coordinación de entrega</h3>
                <p className="text-sm text-gallery-600">
                  Nos pondremos en contacto para coordinar la entrega
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Volver a la galería
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              to="/contacto"
              className="btn-secondary w-full"
            >
              Contactar
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;