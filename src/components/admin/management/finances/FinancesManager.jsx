import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import financesService from '../../../../services/admin/finances.service';
import TransactionCard from './TransactionCard';
import TransactionForm from './TransactionForm';
import FinanceSummary from './FinanceSummary';
import ConfirmModal from '../common/ConfirmModal';

const FinancesManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showSummary, setShowSummary] = useState(true);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: ''
  });

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'artwork_sale', label: 'Venta de obra' },
    { value: 'commission', label: 'Comisión' },
    { value: 'workshop', label: 'Taller/Curso' },
    { value: 'materials', label: 'Materiales' },
    { value: 'studio', label: 'Estudio/Alquiler' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'shipping', label: 'Envíos' },
    { value: 'taxes', label: 'Impuestos' },
    { value: 'services', label: 'Servicios' },
    { value: 'other', label: 'Otro' }
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        year: selectedMonth.year,
        month: selectedMonth.month
      };

      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const [transactionsRes, summaryRes, breakdownRes] = await Promise.all([
        financesService.getTransactions(params),
        financesService.getSummary(params),
        financesService.getCategoryBreakdown(params)
      ]);

      if (transactionsRes.success) {
        setTransactions(transactionsRes.data || []);
      }

      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }

      if (breakdownRes.success) {
        setCategoryBreakdown(breakdownRes.data);
      }
    } catch (err) {
      setError('Error de conexión al cargar los datos');
      console.error('Error fetching finances:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePrevMonth = () => {
    setSelectedMonth(prev => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleCreate = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleSave = async (transactionData) => {
    try {
      setSaving(true);
      setError(null);

      let response;
      if (editingTransaction) {
        response = await financesService.updateTransaction(editingTransaction._id, transactionData);
      } else {
        response = await financesService.createTransaction(transactionData);
      }

      if (response.success) {
        setShowForm(false);
        setEditingTransaction(null);
        fetchData();
      } else {
        setError(response.message || 'Error al guardar la transacción');
      }
    } catch (err) {
      setError('Error de conexión al guardar la transacción');
      console.error('Error saving transaction:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar transacción?',
      message: 'Esta acción no se puede deshacer. La transacción será eliminada permanentemente.',
      onConfirm: async () => {
        try {
          const response = await financesService.deleteTransaction(id);
          if (response.success) {
            fetchData();
          } else {
            setError(response.message || 'Error al eliminar la transacción');
          }
        } catch (err) {
          setError('Error de conexión al eliminar la transacción');
          console.error('Error deleting transaction:', err);
        }
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gallery-900">Finanzas</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className={`btn-secondary flex items-center gap-2 ${showSummary ? 'bg-accent text-white' : ''}`}
          >
            <BarChart3 className="h-4 w-4" />
            Resumen
          </button>
          <button
            onClick={handleCreate}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Transacción
          </button>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-md text-gallery-600 hover:bg-gallery-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            <span className="text-lg font-semibold text-gallery-900">
              {monthNames[selectedMonth.month - 1]} {selectedMonth.year}
            </span>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-md text-gallery-600 hover:bg-gallery-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            &times;
          </button>
        </div>
      )}

      {/* Summary */}
      <AnimatePresence>
        {showSummary && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <FinanceSummary summary={summary} categoryBreakdown={categoryBreakdown} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={saving}
          />
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gallery-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar transacciones..."
              className="input-field pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, type: prev.type === 'income' ? '' : 'income' }))}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-sm transition-colors ${
                filters.type === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gallery-100 text-gallery-600 hover:bg-green-50'
              }`}
            >
              <ArrowUpCircle className="h-4 w-4" />
              Ingresos
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, type: prev.type === 'expense' ? '' : 'expense' }))}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-sm transition-colors ${
                filters.type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gallery-100 text-gallery-600 hover:bg-red-50'
              }`}
            >
              <ArrowDownCircle className="h-4 w-4" />
              Gastos
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-gallery-100 text-gallery-600 hover:bg-gallery-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 text-accent animate-spin" />
        </div>
      )}

      {/* Transactions List */}
      {!loading && (
        <>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {transactions.map(transaction => (
                  <TransactionCard
                    key={transaction._id}
                    transaction={transaction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 text-gallery-500">
              <p className="mb-2">No hay transacciones en este período</p>
              <button
                onClick={handleCreate}
                className="text-accent hover:underline"
              >
                Registrar la primera transacción
              </button>
            </div>
          )}
        </>
      )}
      {/* Confirm Modal */}
      <AnimatePresence>
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
        />
      </AnimatePresence>
    </div>
  );
};

export default FinancesManager;
