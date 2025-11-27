import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const incomeCategories = [
  { value: 'artwork_sale', label: 'Venta de obra' },
  { value: 'commission', label: 'Comisión' },
  { value: 'workshop', label: 'Taller/Curso' },
  { value: 'grant', label: 'Beca/Subsidio' },
  { value: 'royalties', label: 'Regalías' },
  { value: 'other', label: 'Otro' }
];

const expenseCategories = [
  { value: 'materials', label: 'Materiales' },
  { value: 'studio', label: 'Estudio/Alquiler' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'shipping', label: 'Envíos' },
  { value: 'taxes', label: 'Impuestos' },
  { value: 'services', label: 'Servicios' },
  { value: 'equipment', label: 'Equipamiento' },
  { value: 'travel', label: 'Viajes' },
  { value: 'other', label: 'Otro' }
];

const paymentMethods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia bancaria' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'mercadopago', label: 'MercadoPago' },
  { value: 'check', label: 'Cheque' },
  { value: 'other', label: 'Otro' }
];

const currencies = [
  { value: 'ARS', label: 'ARS - Peso Argentino' },
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'EUR', label: 'EUR - Euro' }
];

const TransactionForm = ({ transaction, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    currency: 'ARS',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    reference: '',
    notes: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'expense',
        description: transaction.description || '',
        amount: transaction.amount || '',
        currency: transaction.currency || 'ARS',
        category: transaction.category || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: transaction.paymentMethod || 'cash',
        reference: transaction.reference || '',
        notes: transaction.notes || '',
        tags: transaction.tags || []
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({ ...prev, category: '' }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-soft p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gallery-900">
          {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-md text-gallery-400 hover:text-gallery-600 hover:bg-gallery-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-2">
            Tipo de transacción *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gallery-100 text-gallery-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <ArrowUpCircle className="h-5 w-5" />
              Ingreso
            </button>
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gallery-100 text-gallery-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <ArrowDownCircle className="h-5 w-5" />
              Gasto
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Descripción *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`input-field ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Describe la transacción"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Monto *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Moneda
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-field"
            >
              {currencies.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Categoría *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input-field ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Seleccionar...</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`input-field ${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Payment Method and Reference */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Método de pago
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="input-field"
            >
              {paymentMethods.map(pm => (
                <option key={pm.value} value={pm.value}>{pm.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Referencia/Comprobante
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="input-field"
              placeholder="Nº de factura, recibo, etc."
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Notas
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="input-field resize-none"
            placeholder="Notas adicionales..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-gallery-100 text-gallery-700 px-2 py-1 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
              className="input-field flex-1"
              placeholder="Agregar etiqueta..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gallery-100">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={isLoading}
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Guardando...' : (transaction ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
