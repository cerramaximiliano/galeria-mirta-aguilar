import { motion } from 'framer-motion';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  FileText
} from 'lucide-react';

const categoryLabels = {
  // Income
  artwork_sale: 'Venta de obra',
  commission: 'Comisión',
  workshop: 'Taller/Curso',
  grant: 'Beca/Subsidio',
  royalties: 'Regalías',
  // Expenses
  materials: 'Materiales',
  studio: 'Estudio/Alquiler',
  marketing: 'Marketing',
  shipping: 'Envíos',
  taxes: 'Impuestos',
  services: 'Servicios',
  equipment: 'Equipamiento',
  travel: 'Viajes',
  // Common
  other: 'Otro'
};

const paymentMethodLabels = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  card: 'Tarjeta',
  mercadopago: 'MercadoPago',
  check: 'Cheque',
  other: 'Otro'
};

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-white rounded-lg shadow-soft p-4 border-l-4 ${
        isIncome ? 'border-l-green-500' : 'border-l-red-500'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon and Main Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-full ${
            isIncome ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isIncome ? (
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gallery-900 truncate">
              {transaction.description}
            </h4>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs text-gallery-500">
                <Tag className="h-3 w-3" />
                {categoryLabels[transaction.category] || transaction.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gallery-500">
                <Calendar className="h-3 w-3" />
                {formatDate(transaction.date)}
              </span>
              {transaction.paymentMethod && (
                <span className="inline-flex items-center gap-1 text-xs text-gallery-500">
                  <CreditCard className="h-3 w-3" />
                  {paymentMethodLabels[transaction.paymentMethod] || transaction.paymentMethod}
                </span>
              )}
            </div>

            {transaction.reference && (
              <div className="flex items-center gap-1 text-xs text-gallery-400 mt-1">
                <FileText className="h-3 w-3" />
                Ref: {transaction.reference}
              </div>
            )}

            {transaction.notes && (
              <p className="text-xs text-gallery-500 mt-2 line-clamp-2 italic">
                {transaction.notes}
              </p>
            )}
          </div>
        </div>

        {/* Amount and Actions */}
        <div className="text-right flex-shrink-0">
          <p className={`text-lg font-bold ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}>
            {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, transaction.currency)}
          </p>

          <div className="flex items-center justify-end gap-1 mt-2">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 rounded-md text-gallery-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(transaction._id)}
              className="p-1.5 rounded-md text-gallery-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
