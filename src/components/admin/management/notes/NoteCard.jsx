import { motion } from 'framer-motion';
import {
  Pin,
  Archive,
  Trash2,
  Edit2,
  Bell,
  Paperclip,
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
};

const categoryColors = {
  general: 'border-l-gray-400',
  idea: 'border-l-purple-400',
  task: 'border-l-blue-400',
  reminder: 'border-l-yellow-400',
  important: 'border-l-red-400',
  personal: 'border-l-green-400',
  work: 'border-l-indigo-400'
};

const categoryLabels = {
  general: 'General',
  idea: 'Idea',
  task: 'Tarea',
  reminder: 'Recordatorio',
  important: 'Importante',
  personal: 'Personal',
  work: 'Trabajo'
};

const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const hasReminder = note.reminder?.enabled && note.reminder?.date;
  const reminderDate = hasReminder ? new Date(note.reminder.date) : null;
  const isReminderPast = reminderDate && reminderDate < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-lg shadow-soft border-l-4 ${categoryColors[note.category] || categoryColors.general} ${
        note.isPinned ? 'ring-2 ring-accent ring-opacity-50' : ''
      } ${note.isArchived ? 'opacity-60' : ''}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[note.priority]}`}>
              {priorityLabels[note.priority]}
            </span>
            <span className="text-xs text-gallery-500 bg-gallery-100 px-2 py-0.5 rounded-full">
              {categoryLabels[note.category]}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {note.isPinned && (
              <Pin className="h-4 w-4 text-accent fill-accent" />
            )}
            {note.isArchived && (
              <Archive className="h-4 w-4 text-gallery-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gallery-900 mb-2 line-clamp-2">
          {note.title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-gallery-600 mb-3 line-clamp-3">
          {note.content}
        </p>

        {/* Reminder */}
        {hasReminder && (
          <div className={`flex items-center gap-1 text-xs mb-3 ${
            isReminderPast ? 'text-red-600' : 'text-amber-600'
          }`}>
            <Bell className="h-3 w-3" />
            <span>
              {isReminderPast ? 'Vencido: ' : 'Recordatorio: '}
              {formatDate(note.reminder.date)}
            </span>
          </div>
        )}

        {/* Attachments */}
        {note.attachments && note.attachments.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gallery-500 mb-3">
            <Paperclip className="h-3 w-3" />
            <span>{note.attachments.length} adjunto(s)</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gallery-100">
          <div className="flex items-center text-xs text-gallery-400">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(note.createdAt)}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(note._id)}
              className={`p-1.5 rounded-md transition-colors ${
                note.isPinned
                  ? 'text-accent bg-accent/10 hover:bg-accent/20'
                  : 'text-gallery-400 hover:text-accent hover:bg-gallery-100'
              }`}
              title={note.isPinned ? 'Desfijar' : 'Fijar'}
            >
              <Pin className="h-4 w-4" />
            </button>
            <button
              onClick={() => onToggleArchive(note._id)}
              className={`p-1.5 rounded-md transition-colors ${
                note.isArchived
                  ? 'text-gallery-600 bg-gallery-200 hover:bg-gallery-300'
                  : 'text-gallery-400 hover:text-gallery-600 hover:bg-gallery-100'
              }`}
              title={note.isArchived ? 'Desarchivar' : 'Archivar'}
            >
              <Archive className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 rounded-md text-gallery-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(note._id)}
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

export default NoteCard;
