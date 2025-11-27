import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Bell } from 'lucide-react';

const eventTypes = [
  { value: 'exhibition', label: 'Exposición', color: 'bg-purple-500' },
  { value: 'meeting', label: 'Reunión', color: 'bg-blue-500' },
  { value: 'deadline', label: 'Fecha límite', color: 'bg-red-500' },
  { value: 'workshop', label: 'Taller', color: 'bg-green-500' },
  { value: 'personal', label: 'Personal', color: 'bg-yellow-500' },
  { value: 'other', label: 'Otro', color: 'bg-gray-500' }
];

const reminderOptions = [
  { value: 0, label: 'Al momento' },
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 1440, label: '1 día antes' }
];

const EventForm = ({ event, selectedDate, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '10:00',
    isAllDay: false,
    location: '',
    participants: [],
    reminder: {
      enabled: false,
      minutesBefore: 30
    },
    notes: ''
  });
  const [participantInput, setParticipantInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;

      setFormData({
        title: event.title || '',
        description: event.description || '',
        type: event.type || 'meeting',
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        isAllDay: event.isAllDay || false,
        location: event.location || '',
        participants: event.participants || [],
        reminder: {
          enabled: event.reminder?.enabled || false,
          minutesBefore: event.reminder?.minutesBefore || 30
        },
        notes: event.notes || ''
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        startDate: selectedDate.toISOString().split('T')[0],
        endDate: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [event, selectedDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('reminder.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        reminder: {
          ...prev.reminder,
          [field]: type === 'checkbox' ? checked : (field === 'minutesBefore' ? parseInt(value) : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    const participant = participantInput.trim();
    if (participant && !formData.participants.includes(participant)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
      setParticipantInput('');
    }
  };

  const handleRemoveParticipant = (participantToRemove) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== participantToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Combine date and time
      const startDateTime = formData.isAllDay
        ? new Date(formData.startDate + 'T00:00:00')
        : new Date(formData.startDate + 'T' + formData.startTime);

      const endDateTime = formData.isAllDay
        ? new Date((formData.endDate || formData.startDate) + 'T23:59:59')
        : new Date((formData.endDate || formData.startDate) + 'T' + formData.endTime);

      onSave({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        isAllDay: formData.isAllDay,
        location: formData.location,
        participants: formData.participants,
        reminder: formData.reminder,
        notes: formData.notes
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
          {event ? 'Editar Evento' : 'Nuevo Evento'}
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
            placeholder="Título del evento"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-2">
            Tipo de evento
          </label>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: type.value } })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  formData.type === type.value
                    ? `${type.color} text-white`
                    : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isAllDay"
            name="isAllDay"
            checked={formData.isAllDay}
            onChange={handleChange}
            className="rounded border-gallery-300 text-accent focus:ring-accent"
          />
          <label htmlFor="isAllDay" className="text-sm text-gallery-700">
            Todo el día
          </label>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Fecha de inicio *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
            />
          </div>
          {!formData.isAllDay && (
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Hora de inicio
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Fecha de fin
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          {!formData.isAllDay && (
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Hora de fin
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            placeholder="Lugar del evento"
          />
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
            rows={3}
            className="input-field resize-none"
            placeholder="Descripción del evento..."
          />
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gallery-700 mb-1">
            Participantes
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.participants.map(participant => (
              <span
                key={participant}
                className="inline-flex items-center gap-1 bg-gallery-100 text-gallery-700 px-2 py-1 rounded-full text-sm"
              >
                {participant}
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(participant)}
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
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant(e)}
              className="input-field flex-1"
              placeholder="Agregar participante..."
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="btn-secondary"
            >
              <Plus className="h-4 w-4" />
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
            <select
              name="reminder.minutesBefore"
              value={formData.reminder.minutesBefore}
              onChange={handleChange}
              className="input-field"
            >
              {reminderOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
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
            {isLoading ? 'Guardando...' : (event ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EventForm;
