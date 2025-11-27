import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Bell, Paperclip, Trash2, Upload } from 'lucide-react';

const categories = [
  { value: 'general', label: 'General' },
  { value: 'idea', label: 'Idea' },
  { value: 'task', label: 'Tarea' },
  { value: 'reminder', label: 'Recordatorio' },
  { value: 'important', label: 'Importante' },
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Trabajo' }
];

const priorities = [
  { value: 'low', label: 'Baja', color: 'bg-green-500' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-500' },
  { value: 'high', label: 'Alta', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-500' }
];

const NoteForm = ({ note, onSave, onCancel, onAddAttachment, onRemoveAttachment, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    tags: [],
    reminder: {
      enabled: false,
      date: ''
    }
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        category: note.category || 'general',
        priority: note.priority || 'medium',
        tags: note.tags || [],
        reminder: {
          enabled: note.reminder?.enabled || false,
          date: note.reminder?.date ? new Date(note.reminder.date).toISOString().slice(0, 16) : ''
        }
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('reminder.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        reminder: {
          ...prev.reminder,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && note?._id && onAddAttachment) {
      await onAddAttachment(note._id, file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    }
    if (formData.reminder.enabled && !formData.reminder.date) {
      newErrors['reminder.date'] = 'Selecciona una fecha para el recordatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSave = {
        ...formData,
        reminder: formData.reminder.enabled ? formData.reminder : { enabled: false }
      };
      onSave(dataToSave);
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
          {note ? 'Editar Nota' : 'Nueva Nota'}
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
            placeholder="Título de la nota"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Contenido *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className={`input-field resize-none ${errors.content ? 'border-red-500' : ''}`}
            placeholder="Escribe el contenido de la nota..."
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content}</p>
          )}
        </div>

        {/* Category and Priority */}
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
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Prioridad
            </label>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
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

        {/* Reminder */}
        <div className="bg-gallery-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="reminderEnabled"
              name="reminder.enabled"
              checked={formData.reminder.enabled}
              onChange={handleChange}
              className="rounded border-gallery-300 text-accent focus:ring-accent"
            />
            <label htmlFor="reminderEnabled" className="flex items-center gap-2 text-sm font-medium text-gallery-700">
              <Bell className="h-4 w-4" />
              Activar recordatorio
            </label>
          </div>

          {formData.reminder.enabled && (
            <div>
              <input
                type="datetime-local"
                name="reminder.date"
                value={formData.reminder.date}
                onChange={handleChange}
                className={`input-field ${errors['reminder.date'] ? 'border-red-500' : ''}`}
              />
              {errors['reminder.date'] && (
                <p className="text-red-500 text-xs mt-1">{errors['reminder.date']}</p>
              )}
            </div>
          )}
        </div>

        {/* Attachments (only when editing) */}
        {note && (
          <div className="bg-gallery-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-gallery-600" />
              <span className="text-sm font-medium text-gallery-700">Archivos adjuntos</span>
            </div>

            {note.attachments && note.attachments.length > 0 && (
              <div className="space-y-2 mb-3">
                {note.attachments.map((attachment, index) => (
                  <div
                    key={attachment._id || index}
                    className="flex items-center justify-between bg-white p-2 rounded-md"
                  >
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline truncate flex-1"
                    >
                      {attachment.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment && onRemoveAttachment(note._id, attachment._id)}
                      className="p-1 text-gallery-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gallery-300 rounded-lg cursor-pointer hover:border-accent hover:bg-white transition-colors">
              <Upload className="h-4 w-4 text-gallery-400" />
              <span className="text-sm text-gallery-600">Subir archivo</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

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
            {isLoading ? 'Guardando...' : (note ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NoteForm;
