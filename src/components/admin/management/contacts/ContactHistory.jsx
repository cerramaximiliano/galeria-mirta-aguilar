import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, ShoppingBag, Package, Calendar, DollarSign, Link2, ExternalLink, RefreshCw } from 'lucide-react';
import financesService from '../../../../services/admin/finances.service';

const ContactHistory = ({ contact, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, incomeCount: 0, expenseCount: 0 });

  useEffect(() => {
    fetchTransactions();
  }, [contact._id]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await financesService.getTransactionsByContact(contact._id);
      if (response.success) {
        setTransactions(response.data.transactions || []);
        setTotals(response.data.totals || { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 });
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const categoryLabels = {
    // Income
    artwork_sale: 'Venta de obra',
    digital_sale: 'Venta digital',
    commission: 'Comisión',
    exhibition: 'Exposición',
    workshop: 'Taller',
    other_income: 'Otro ingreso',
    // Expense
    materials: 'Materiales',
    framing: 'Enmarcado',
    shipping: 'Envío',
    marketing: 'Marketing',
    rent: 'Alquiler',
    utilities: 'Servicios',
    taxes: 'Impuestos',
    insurance: 'Seguros',
    services: 'Servicios prof.',
    other_expense: 'Otro gasto'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gallery-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gallery-900">
              Historial de {contact.name}
            </h3>
            <p className="text-sm text-gallery-500 flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              Transacciones vinculadas desde Finanzas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gallery-400 hover:text-gallery-600 hover:bg-gallery-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gallery-50 grid grid-cols-2 gap-4">
          {(contact.type === 'client' || contact.type === 'both') && (
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm font-medium">Ventas ({totals.incomeCount})</span>
              </div>
              <p className="text-lg font-bold text-gallery-900">
                {formatCurrency(totals.income)}
              </p>
            </div>
          )}
          {(contact.type === 'supplier' || contact.type === 'both') && (
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">Gastos ({totals.expenseCount})</span>
              </div>
              <p className="text-lg font-bold text-gallery-900">
                {formatCurrency(totals.expense)}
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-3 bg-blue-50 border-y border-blue-100">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Para agregar transacciones, ve a <strong>Finanzas</strong> y selecciona este contacto al crear un gasto o ingreso.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-8 w-8 text-accent animate-spin" />
          </div>
        )}

        {/* Transactions List */}
        {!loading && (
          <div className="p-4 overflow-y-auto max-h-[40vh]">
            {transactions.length === 0 ? (
              <p className="text-center text-gallery-500 py-8">
                No hay transacciones vinculadas a este contacto
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const isIncome = transaction.type === 'income';
                  const TypeIcon = isIncome ? ShoppingBag : Package;
                  const typeColor = isIncome ? 'text-green-600' : 'text-red-600';
                  const typeBg = isIncome ? 'bg-green-50' : 'bg-red-50';

                  return (
                    <div
                      key={transaction._id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${typeBg}`}
                    >
                      <div className={`p-2 rounded-full bg-white ${typeColor}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gallery-900 truncate">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gallery-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(transaction.date)}
                          </span>
                          <span className="bg-gallery-200 px-1.5 py-0.5 rounded">
                            {categoryLabels[transaction.category] || transaction.category}
                          </span>
                          {transaction.invoiceNumber && (
                            <span>#{transaction.invoiceNumber}</span>
                          )}
                        </div>
                      </div>
                      <div className={`text-right ${typeColor}`}>
                        <p className="font-bold">
                          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gallery-100 flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactHistory;
