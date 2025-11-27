import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, ShoppingBag, Package, Calendar, DollarSign } from 'lucide-react';

const historyTypes = [
  { value: 'purchase', label: 'Compra', icon: ShoppingBag, color: 'text-blue-600' },
  { value: 'supply', label: 'Suministro', icon: Package, color: 'text-purple-600' }
];

const ContactHistory = ({ contact, onAddHistory, onRemoveHistory, onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'purchase',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

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

  const handleAddEntry = () => {
    if (newEntry.description && newEntry.amount) {
      onAddHistory(contact._id, {
        ...newEntry,
        amount: parseFloat(newEntry.amount)
      });
      setNewEntry({
        type: 'purchase',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
    }
  };

  const purchases = contact.purchaseHistory || [];
  const supplies = contact.supplyHistory || [];
  const allHistory = [
    ...purchases.map(p => ({ ...p, historyType: 'purchase' })),
    ...supplies.map(s => ({ ...s, historyType: 'supply' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

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
            <p className="text-sm text-gallery-500">
              {purchases.length} compras · {supplies.length} suministros
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
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-sm font-medium">Total Compras</span>
            </div>
            <p className="text-lg font-bold text-gallery-900">
              {formatCurrency(contact.totalPurchases)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Package className="h-4 w-4" />
              <span className="text-sm font-medium">Total Suministros</span>
            </div>
            <p className="text-lg font-bold text-gallery-900">
              {formatCurrency(contact.totalSupplies)}
            </p>
          </div>
        </div>

        {/* Add Button */}
        <div className="p-4 border-b border-gallery-100">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar entrada
            </button>
          ) : (
            <div className="space-y-3 bg-gallery-50 p-4 rounded-lg">
              <div className="flex gap-2">
                {historyTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setNewEntry(prev => ({ ...prev, type: type.value }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      newEntry.type === type.value
                        ? 'bg-accent text-white'
                        : 'bg-white text-gallery-600 hover:bg-gallery-100'
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción"
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Monto"
                  className="input-field"
                />
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEntry}
                  className="btn-primary flex-1"
                >
                  Agregar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="p-4 overflow-y-auto max-h-[40vh]">
          {allHistory.length === 0 ? (
            <p className="text-center text-gallery-500 py-8">
              No hay historial registrado
            </p>
          ) : (
            <div className="space-y-3">
              {allHistory.map((entry, index) => {
                const TypeIcon = entry.historyType === 'purchase' ? ShoppingBag : Package;
                const typeColor = entry.historyType === 'purchase' ? 'text-blue-600' : 'text-purple-600';
                const typeBg = entry.historyType === 'purchase' ? 'bg-blue-50' : 'bg-purple-50';

                return (
                  <div
                    key={entry._id || index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${typeBg}`}
                  >
                    <div className={`p-2 rounded-full bg-white ${typeColor}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gallery-900 truncate">
                        {entry.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gallery-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(entry.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(entry.amount)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveHistory(contact._id, entry._id)}
                      className="p-1.5 rounded-md text-gallery-400 hover:text-red-600 hover:bg-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactHistory;
