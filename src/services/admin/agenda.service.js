import api from '../api';
import { API_ENDPOINTS } from '../../config/api';

const agendaService = {
  // ========== EVENTOS ==========

  // Obtener eventos
  async getEvents(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.events, params);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener eventos próximos
  async getUpcomingEvents(days = 7) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.upcomingEvents, { days });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener eventos de hoy
  async getTodayEvents() {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.todayEvents);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener un evento
  async getEvent(id) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.eventDetail(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Crear evento
  async createEvent(data) {
    try {
      const response = await api.post(API_ENDPOINTS.admin.agenda.createEvent, data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar evento
  async updateEvent(id, data) {
    try {
      const response = await api.put(API_ENDPOINTS.admin.agenda.updateEvent(id), data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar evento
  async deleteEvent(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.admin.agenda.deleteEvent(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar estado del evento
  async updateEventStatus(id, status) {
    try {
      const response = await api.patch(API_ENDPOINTS.admin.agenda.updateEventStatus(id), { status });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener calendario del mes
  async getCalendar(year, month) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.calendar(year, month));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ========== TAREAS ==========

  // Obtener tareas
  async getTasks(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.tasks, params);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener estadísticas de tareas
  async getTaskStats() {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.taskStats);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener tareas pendientes
  async getPendingTasks() {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.pendingTasks);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener una tarea
  async getTask(id) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.agenda.taskDetail(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Crear tarea
  async createTask(data) {
    try {
      const response = await api.post(API_ENDPOINTS.admin.agenda.createTask, data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar tarea
  async updateTask(id, data) {
    try {
      const response = await api.put(API_ENDPOINTS.admin.agenda.updateTask(id), data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar tarea
  async deleteTask(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.admin.agenda.deleteTask(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar estado de tarea
  async updateTaskStatus(id, status) {
    try {
      const response = await api.patch(API_ENDPOINTS.admin.agenda.updateTaskStatus(id), { status });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Toggle item del checklist
  async toggleChecklistItem(taskId, itemIndex) {
    try {
      const response = await api.patch(API_ENDPOINTS.admin.agenda.toggleChecklistItem(taskId, itemIndex));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

export default agendaService;
