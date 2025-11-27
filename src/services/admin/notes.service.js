import api from '../api';
import { API_ENDPOINTS } from '../../config/api';

const notesService = {
  // Obtener todas las notas
  async getNotes(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.notes.list, params);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener notas urgentes
  async getUrgentNotes() {
    try {
      const response = await api.get(API_ENDPOINTS.admin.notes.urgent);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener una nota
  async getNote(id) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.notes.detail(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Crear nota
  async createNote(data) {
    try {
      const response = await api.post(API_ENDPOINTS.admin.notes.create, data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar nota
  async updateNote(id, data) {
    try {
      const response = await api.put(API_ENDPOINTS.admin.notes.update(id), data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar nota
  async deleteNote(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.admin.notes.delete(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Toggle pin
  async togglePin(id) {
    try {
      const response = await api.patch(API_ENDPOINTS.admin.notes.togglePin(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Toggle archive
  async toggleArchive(id) {
    try {
      const response = await api.patch(API_ENDPOINTS.admin.notes.toggleArchive(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Agregar archivo adjunto
  async addAttachment(id, file) {
    try {
      const response = await api.upload(API_ENDPOINTS.admin.notes.addAttachment(id), file);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar archivo adjunto
  async removeAttachment(id, attachmentId) {
    try {
      const response = await api.delete(API_ENDPOINTS.admin.notes.removeAttachment(id, attachmentId));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

export default notesService;
