import { motion } from 'framer-motion';
import {
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Loader
} from 'lucide-react';

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  urgent: 'text-red-600'
};

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
};

const statusIcons = {
  pending: Circle,
  in_progress: Loader,
  completed: CheckCircle
};

const statusColors = {
  pending: 'text-gray-400',
  in_progress: 'text-blue-500',
  completed: 'text-green-500'
};

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada'
};

const TaskCard = ({ task, onEdit, onDelete, onUpdateStatus, onToggleChecklistItem }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const StatusIcon = statusIcons[task.status] || Circle;

  const completedItems = task.checklist?.filter(item => item.completed).length || 0;
  const totalItems = task.checklist?.length || 0;
  const checklistProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleStatusCycle = () => {
    const statusOrder = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onUpdateStatus(task._id, nextStatus);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white rounded-lg shadow-soft p-4 ${
        task.status === 'completed' ? 'opacity-60' : ''
      } ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Status Toggle */}
        <button
          onClick={handleStatusCycle}
          className={`mt-0.5 ${statusColors[task.status]} hover:scale-110 transition-transform`}
          title={`Estado: ${statusLabels[task.status]}`}
        >
          <StatusIcon className={`h-5 w-5 ${task.status === 'in_progress' ? 'animate-spin' : ''}`} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className={`font-medium ${
            task.status === 'completed' ? 'text-gallery-400 line-through' : 'text-gallery-900'
          }`}>
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gallery-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`flex items-center gap-1 text-xs ${priorityColors[task.priority]}`}>
              <AlertTriangle className="h-3 w-3" />
              {priorityLabels[task.priority]}
            </span>

            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gallery-500'}`}>
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
                {isOverdue && ' (Vencida)'}
              </span>
            )}

            {task.estimatedTime && (
              <span className="flex items-center gap-1 text-xs text-gallery-500">
                <Clock className="h-3 w-3" />
                {task.estimatedTime} min
              </span>
            )}
          </div>

          {/* Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gallery-500 mb-1">
                <span>Checklist</span>
                <span>{completedItems}/{totalItems}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-gallery-100 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${checklistProgress}%` }}
                  className="h-full bg-accent rounded-full"
                />
              </div>

              {/* Checklist items */}
              <div className="space-y-1">
                {task.checklist.slice(0, 3).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => onToggleChecklistItem(task._id, index)}
                    className="flex items-center gap-2 text-sm text-gallery-600 hover:text-gallery-900 w-full text-left"
                  >
                    {item.completed ? (
                      <CheckSquare className="h-4 w-4 text-accent flex-shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-gallery-400 flex-shrink-0" />
                    )}
                    <span className={item.completed ? 'line-through text-gallery-400' : ''}>
                      {item.text}
                    </span>
                  </button>
                ))}
                {task.checklist.length > 3 && (
                  <span className="text-xs text-gallery-400">
                    +{task.checklist.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Related Event */}
          {task.relatedEvent && (
            <div className="mt-2 text-xs text-accent">
              Vinculado a evento
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-gallery-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
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

export default TaskCard;
