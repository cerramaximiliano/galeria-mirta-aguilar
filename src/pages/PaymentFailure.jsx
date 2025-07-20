import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  
  // Obtener parámetros de MercadoPago
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-red-50 to-gallery-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 25,
              delay: 0.3 
            }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="h-12 w-12 text-red-600" />
          </motion.div>

          <h1 className="text-3xl font-serif font-bold text-gallery-900 mb-3">
            Pago no completado
          </h1>
          
          <p className="text-gallery-600 mb-8">
            No pudimos procesar tu pago. No te preocupes, tu carrito sigue disponible.
          </p>

          {/* Error Info */}
          {(paymentId || status) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-red-800">
                {status === 'rejected' && 'El pago fue rechazado. Verifica los datos e intenta nuevamente.'}
                {status === 'cancelled' && 'El pago fue cancelado.'}
                {!status && 'Ocurrió un error al procesar el pago.'}
              </p>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-gallery-50 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-gallery-900 mb-3 flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5" />
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-sm text-gallery-600 space-y-2 text-left">
              <li>• Verifica que tienes fondos suficientes</li>
              <li>• Revisa que los datos de tu tarjeta sean correctos</li>
              <li>• Intenta con otro medio de pago</li>
              <li>• Contacta con tu banco si el problema persiste</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/carrito"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar compra
            </Link>
            
            <Link
              to="/"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la galería
            </Link>
            
            <Link
              to="/contacto"
              className="text-sm text-gallery-600 hover:text-gallery-900 transition-colors"
            >
              ¿Necesitas ayuda? Contáctanos
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentFailure;