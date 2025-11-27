import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const eventTypeLabels = {
  exhibition: 'Exposición',
  meeting: 'Reunión',
  deadline: 'Fecha límite',
  workshop: 'Taller',
  personal: 'Personal',
  other: 'Otro'
};

const eventTypeColors = {
  exhibition: 'bg-purple-100 text-purple-800 border-l-purple-500',
  meeting: 'bg-blue-100 text-blue-800 border-l-blue-500',
  deadline: 'bg-red-100 text-red-800 border-l-red-500',
  workshop: 'bg-green-100 text-green-800 border-l-green-500',
  personal: 'bg-yellow-100 text-yellow-800 border-l-yellow-500',
  other: 'bg-gray-100 text-gray-800 border-l-gray-500'
};

const statusIcons = {
  scheduled: Calendar,
  confirmed: CheckCircle,
  cancelled: XCircle,
  completed: CheckCircle
};

const statusColors = {
  scheduled: 'text-blue-500',
  confirmed: 'text-green-500',
  cancelled: 'text-red-500',
  completed: 'text-gray-400'
};

const EventCard = ({ event, onEdit, onDelete, onUpdateStatus }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusIcon = statusIcons[event.status] || Calendar;
  const colorClass = eventTypeColors[event.type] || eventTypeColors.other;

  const isPast = new Date(event.endDate || event.startDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white rounded-lg shadow-soft border-l-4 overflow-hidden ${
        colorClass.split(' ')[2]
      } ${isPast && event.status !== 'completed' ? 'opacity-60' : ''}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass.split(' ').slice(0, 2).join(' ')}`}>
              {eventTypeLabels[event.type]}
            </span>
            <StatusIcon className={`h-4 w-4 ${statusColors[event.status]}`} />
          </div>
          {event.isAllDay && (
            <span className="text-xs bg-gallery-100 text-gallery-600 px-2 py-0.5 rounded-full">
              Todo el día
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-semibold text-gallery-900 mb-2">{event.title}</h4>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gallery-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Details */}
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-gallery-600">
            <Calendar className="h-4 w-4 text-gallery-400" />
            <span>{formatDate(event.startDate)}</span>
            {event.endDate && event.endDate !== event.startDate && (
              <span>- {formatDate(event.endDate)}</span>
            )}
          </div>

          {!event.isAllDay && (
            <div className="flex items-center gap-2 text-gallery-600">
              <Clock className="h-4 w-4 text-gallery-400" />
              <span>{formatTime(event.startDate)}</span>
              {event.endDate && (
                <span>- {formatTime(event.endDate)}</span>
              )}
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 text-gallery-600">
              <MapPin className="h-4 w-4 text-gallery-400" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {event.participants && event.participants.length > 0 && (
            <div className="flex items-center gap-2 text-gallery-600">
              <Users className="h-4 w-4 text-gallery-400" />
              <span>{event.participants.length} participante(s)</span>
            </div>
          )}
        </div>

        {/* Reminder */}
        {event.reminder?.enabled && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
            <AlertCircle className="h-3 w-3" />
            <span>Recordatorio: {event.reminder.minutesBefore} min antes</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gallery-50 flex items-center justify-between">
        <div className="flex gap-1">
          {event.status !== 'completed' && event.status !== 'cancelled' && (
            <>
              <button
                onClick={() => onUpdateStatus(event._id, 'completed')}
                className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
              >
                Completar
              </button>
              <button
                onClick={() => onUpdateStatus(event._id, 'cancelled')}
                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 rounded-md text-gallery-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="p-1.5 rounded-md text-gallery-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
