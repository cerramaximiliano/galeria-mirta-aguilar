import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const priorities = [
  { value: 'low', label: 'Baja', color: 'bg-green-500' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-500' },
  { value: 'high', label: 'Alta', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-500' }
];

const statuses = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completada' }
];

const TaskForm = ({ task, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    estimatedTime: '',
    checklist: [],
    tags: []
  });
  const [checklistInput, setChecklistInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedTime: task.estimatedTime || '',
        checklist: task.checklist || [],
        tags: task.tags || []
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    const text = checklistInput.trim();
    if (text) {
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, { text, completed: false }]
      }));
      setChecklistInput('');
    }
  };

  const handleRemoveChecklistItem = (index) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const handleToggleChecklistItem = (index) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    }));
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
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
        dueDate: formData.dueDate || null
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-soft p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gallery-900">
          {task ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-md text-gallery-400 hover:text-gallery-600 hover:bg-gallery-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
            placeholder="¿Qué necesitas hacer?"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="input-field resize-none"
            placeholder="Detalles adicionales..."
          />
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-2">
              Prioridad
            </label>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                  className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                    formData.priority === p.value
                      ? `${p.color} text-white`
                      : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date and Estimated Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Fecha límite
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Tiempo estimado (minutos)
            </label>
            <input
              type="number"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              min="0"
              className="input-field"
              placeholder="ej: 30"
            />
          </div>
        </div>

        {/* Checklist */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-2">
            Checklist
          </label>

          {formData.checklist.length > 0 && (
            <div className="space-y-2 mb-3 bg-gallery-50 p-3 rounded-lg">
              {formData.checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleChecklistItem(index)}
                    className={`p-0.5 rounded ${item.completed ? 'text-accent' : 'text-gallery-400'}`}
                  >
                    {item.completed ? (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gallery-400' : 'text-gallery-700'}`}>
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(index)}
                    className="p-1 text-gallery-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={checklistInput}
              onChange={(e) => setChecklistInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem(e)}
              className="input-field flex-1"
              placeholder="Agregar elemento..."
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              className="btn-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
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
            {isLoading ? 'Guardando...' : (task ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;
