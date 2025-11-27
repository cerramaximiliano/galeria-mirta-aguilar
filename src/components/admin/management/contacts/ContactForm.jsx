import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const types = [
  { value: 'client', label: 'Cliente' },
  { value: 'supplier', label: 'Proveedor' },
  { value: 'both', label: 'Ambos' }
];

const clientCategories = [
  { value: 'collector', label: 'Coleccionista' },
  { value: 'gallery', label: 'Galería' },
  { value: 'museum', label: 'Museo' },
  { value: 'art_dealer', label: 'Marchante' },
  { value: 'other', label: 'Otro' }
];

const supplierCategories = [
  { value: 'materials', label: 'Materiales' },
  { value: 'services', label: 'Servicios' },
  { value: 'framing', label: 'Enmarcado' },
  { value: 'printing', label: 'Impresión' },
  { value: 'other', label: 'Otro' }
];

const ContactForm = ({ contact, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'client',
    company: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Argentina'
    },
    category: '',
    taxId: '',
    notes: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        type: contact.type || 'client',
        company: contact.company || '',
        email: contact.email || '',
        phone: contact.phone || '',
        address: {
          street: contact.address?.street || '',
          city: contact.address?.city || '',
          province: contact.address?.province || '',
          postalCode: contact.address?.postalCode || '',
          country: contact.address?.country || 'Argentina'
        },
        category: contact.category || '',
        taxId: contact.taxId || '',
        notes: contact.notes || '',
        tags: contact.tags || []
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Reset category when type changes
      if (name === 'type') {
        setFormData(prev => ({ ...prev, category: '' }));
      }
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
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const availableCategories = formData.type === 'supplier' ? supplierCategories :
    formData.type === 'client' ? clientCategories :
    [...clientCategories, ...supplierCategories];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-soft p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gallery-900">
          {contact ? 'Editar Contacto' : 'Nuevo Contacto'}
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
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Tipo de contacto *
          </label>
          <div className="flex gap-2">
            {types.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: t.value } })}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  formData.type === t.value
                    ? 'bg-accent text-white'
                    : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Name and Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Nombre completo"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Empresa/Organización
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              placeholder="Nombre de la empresa"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+54 11 1234-5678"
            />
          </div>
        </div>

        {/* Category and Tax ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar categoría</option>
              {availableCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              CUIT/DNI
            </label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className="input-field"
              placeholder="XX-XXXXXXXX-X"
            />
          </div>
        </div>

        {/* Address */}
        <div className="bg-gallery-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gallery-700 mb-3">Dirección</h4>
          <div className="space-y-3">
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="input-field"
              placeholder="Calle y número"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="input-field"
                placeholder="Ciudad"
              />
              <input
                type="text"
                name="address.province"
                value={formData.address.province}
                onChange={handleChange}
                className="input-field"
                placeholder="Provincia"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                className="input-field"
                placeholder="Código postal"
              />
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="input-field"
                placeholder="País"
              />
            </div>
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
            rows={3}
            className="input-field resize-none"
            placeholder="Notas adicionales sobre este contacto..."
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
              <Plus className="h-4 w-4" />
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
            {isLoading ? 'Guardando...' : (contact ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
