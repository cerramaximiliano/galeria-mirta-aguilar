import api from '../api';
import { API_ENDPOINTS } from '../../config/api';

const contactsService = {
  // Obtener todos los contactos
  async getContacts(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.contacts.list, params);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener estadísticas
  async getStats() {
    try {
      const response = await api.get(API_ENDPOINTS.admin.contacts.stats);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener un contacto
  async getContact(id) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.contacts.detail(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Crear contacto
  async createContact(data) {
    try {
      const response = await api.post(API_ENDPOINTS.admin.contacts.create, data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar contacto
  async updateContact(id, data) {
    try {
      const response = await api.put(API_ENDPOINTS.admin.contacts.update(id), data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar contacto
  async deleteContact(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.admin.contacts.delete(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Toggle favorito
  async toggleFavorite(id) {
    try {
      const response = await api.patch(API_ENDPOINTS.admin.contacts.toggleFavorite(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Toggle activo
  async toggleActive(id) {
    try {
      const response = await api.patch(API_ENDPOINTS.admin.contacts.toggleActive(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Agregar al historial
  async addHistory(id, data) {
    try {
      const response = await api.post(API_ENDPOINTS.admin.contacts.addHistory(id), data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar del historial
  async removeHistory(id, historyId) {
    try {
      const response = await api.delete(API_ENDPOINTS.admin.contacts.removeHistory(id, historyId));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

export default contactsService;
