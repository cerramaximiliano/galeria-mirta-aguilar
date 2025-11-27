import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar as CalendarIcon,
  ListTodo,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import agendaService from '../../../../services/admin/agenda.service';
import SimpleCalendar from './SimpleCalendar';
import EventCard from './EventCard';
import EventForm from './EventForm';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const AgendaManager = () => {
  const [activeView, setActiveView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Events state
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      const response = await agendaService.getCalendar(year, month);
      if (response.success) {
        setEvents(response.data?.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }, [selectedDate]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (taskFilter === 'pending') params.status = 'pending';
      if (taskFilter === 'in_progress') params.status = 'in_progress';
      if (taskFilter === 'completed') params.status = 'completed';

      const [tasksRes, statsRes] = await Promise.all([
        agendaService.getTasks(params),
        agendaService.getTaskStats()
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data || []);
      }
      if (statsRes.success) {
        setTaskStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }, [taskFilter]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchTasks()]);
      setLoading(false);
    };
    loadData();
  }, [fetchEvents, fetchTasks]);

  // Event handlers
  const handleMonthChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      setSaving(true);
      setError(null);

      let response;
      if (editingEvent) {
        response = await agendaService.updateEvent(editingEvent._id, eventData);
      } else {
        response = await agendaService.createEvent(eventData);
      }

      if (response.success) {
        setShowEventForm(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        setError(response.message || 'Error al guardar el evento');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      const response = await agendaService.deleteEvent(id);
      if (response.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleUpdateEventStatus = async (id, status) => {
    try {
      const response = await agendaService.updateEventStatus(id, status);
      if (response.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Error updating event status:', err);
    }
  };

  // Task handlers
  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      setSaving(true);
      setError(null);

      let response;
      if (editingTask) {
        response = await agendaService.updateTask(editingTask._id, taskData);
      } else {
        response = await agendaService.createTask(taskData);
      }

      if (response.success) {
        setShowTaskForm(false);
        setEditingTask(null);
        fetchTasks();
      } else {
        setError(response.message || 'Error al guardar la tarea');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const response = await agendaService.deleteTask(id);
      if (response.success) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      const response = await agendaService.updateTaskStatus(id, status);
      if (response.success) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleToggleChecklistItem = async (taskId, itemIndex) => {
    try {
      const response = await agendaService.toggleChecklistItem(taskId, itemIndex);
      if (response.success) {
        setTasks(prev => prev.map(task =>
          task._id === taskId ? response.data : task
        ));
      }
    } catch (err) {
      console.error('Error toggling checklist item:', err);
    }
  };

  // Get events for selected date
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.startDate).toDateString();
    return eventDate === selectedDate.toDateString();
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gallery-900">Agenda</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={activeView === 'calendar' ? handleCreateEvent : handleCreateTask}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {activeView === 'calendar' ? 'Nuevo Evento' : 'Nueva Tarea'}
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow-soft p-1 mb-6 inline-flex">
        <button
          onClick={() => setActiveView('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeView === 'calendar'
              ? 'bg-accent text-white'
              : 'text-gallery-600 hover:bg-gallery-100'
          }`}
        >
          <CalendarIcon className="h-4 w-4" />
          Calendario
        </button>
        <button
          onClick={() => setActiveView('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeView === 'tasks'
              ? 'bg-accent text-white'
              : 'text-gallery-600 hover:bg-gallery-100'
          }`}
        >
          <ListTodo className="h-4 w-4" />
          Tareas
          {taskStats?.pending > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {taskStats.pending}
            </span>
          )}
        </button>
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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 text-accent animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {/* Calendar View */}
          {activeView === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <SimpleCalendar
                  selectedDate={selectedDate}
                  events={events}
                  onDateSelect={handleDateSelect}
                  onMonthChange={handleMonthChange}
                />
              </div>

              {/* Events for selected date */}
              <div className="lg:col-span-2">
                {/* Event Form */}
                <AnimatePresence>
                  {showEventForm && (
                    <EventForm
                      event={editingEvent}
                      selectedDate={selectedDate}
                      onSave={handleSaveEvent}
                      onCancel={() => {
                        setShowEventForm(false);
                        setEditingEvent(null);
                      }}
                      isLoading={saving}
                    />
                  )}
                </AnimatePresence>

                <div className="bg-white rounded-lg shadow-soft p-4">
                  <h3 className="font-semibold text-gallery-900 mb-4">
                    Eventos - {selectedDate.toLocaleDateString('es-AR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </h3>

                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {selectedDateEvents.map(event => (
                          <EventCard
                            key={event._id}
                            event={event}
                            onEdit={handleEditEvent}
                            onDelete={handleDeleteEvent}
                            onUpdateStatus={handleUpdateEventStatus}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gallery-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No hay eventos para este día</p>
                      <button
                        onClick={handleCreateEvent}
                        className="text-accent hover:underline mt-2"
                      >
                        Crear evento
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tasks View */}
          {activeView === 'tasks' && (
            <div>
              {/* Task Stats */}
              {taskStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-soft p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <ListTodo className="h-4 w-4" />
                      <span className="text-sm">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gallery-900">{taskStats.total || 0}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-soft p-4">
                    <div className="flex items-center gap-2 text-yellow-500 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Pendientes</span>
                    </div>
                    <p className="text-2xl font-bold text-gallery-900">{taskStats.pending || 0}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-soft p-4">
                    <div className="flex items-center gap-2 text-blue-500 mb-1">
                      <RefreshCw className="h-4 w-4" />
                      <span className="text-sm">En progreso</span>
                    </div>
                    <p className="text-2xl font-bold text-gallery-900">{taskStats.inProgress || 0}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-soft p-4">
                    <div className="flex items-center gap-2 text-red-500 mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Vencidas</span>
                    </div>
                    <p className="text-2xl font-bold text-gallery-900">{taskStats.overdue || 0}</p>
                  </div>
                </div>
              )}

              {/* Task Form */}
              <AnimatePresence>
                {showTaskForm && (
                  <TaskForm
                    task={editingTask}
                    onSave={handleSaveTask}
                    onCancel={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                    }}
                    isLoading={saving}
                  />
                )}
              </AnimatePresence>

              {/* Task Filters */}
              <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Todas' },
                    { value: 'pending', label: 'Pendientes' },
                    { value: 'in_progress', label: 'En progreso' },
                    { value: 'completed', label: 'Completadas' }
                  ].map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setTaskFilter(filter.value)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        taskFilter === filter.value
                          ? 'bg-accent text-white'
                          : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                  <button
                    onClick={fetchTasks}
                    className="ml-auto p-2 rounded-md bg-gallery-100 text-gallery-600 hover:bg-gallery-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {tasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onUpdateStatus={handleUpdateTaskStatus}
                        onToggleChecklistItem={handleToggleChecklistItem}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12 text-gallery-500 bg-white rounded-lg shadow-soft">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="mb-2">
                    {taskFilter === 'all'
                      ? 'No hay tareas'
                      : `No hay tareas ${taskFilter === 'pending' ? 'pendientes' : taskFilter === 'in_progress' ? 'en progreso' : 'completadas'}`
                    }
                  </p>
                  <button
                    onClick={handleCreateTask}
                    className="text-accent hover:underline"
                  >
                    Crear tarea
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AgendaManager;
