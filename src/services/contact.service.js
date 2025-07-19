import api from './api';
import { API_ENDPOINTS } from '../config/api';

class ContactService {
  // Enviar mensaje de contacto
  async sendMessage(contactData) {
    try {
      // Usar el endpoint de la API real
      const response = await api.post('/contact', {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || undefined,
        subject: contactData.subject,
        message: contactData.message
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Contact Service: Error al enviar mensaje:', error);
      console.error('📊 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      
      // Re-lanzar el error para que sea manejado por el componente
      throw error;
    }
  }

  // Validar datos de contacto
  validateContactData(data) {
    const errors = {};
    
    // Validar nombre
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Email inválido';
    }
    
    // Validar asunto
    if (!data.subject || data.subject.trim().length < 5) {
      errors.subject = 'El asunto debe tener al menos 5 caracteres';
    }
    
    // Validar mensaje
    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    // Validar teléfono (opcional)
    if (data.phone) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(data.phone) || data.phone.length < 9) {
        errors.phone = 'Teléfono inválido';
      }
    }
    
    return errors;
  }

  // Formatear datos de contacto para envío
  formatContactData(data) {
    return {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      phone: data.phone ? data.phone.trim() : null,
      source: data.source || 'website',
      timestamp: new Date().toISOString()
    };
  }

  // Obtener mensajes de contacto (admin)
  async getMessages(params = {}) {
    try {
      const response = await api.get('/contact', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Contact Service: Error al obtener mensajes:', error);
      console.error('📊 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          params: error.config?.params
        }
      });
      throw error;
    }
  }

  // Obtener un mensaje específico (admin)
  async getMessage(messageId) {
    try {
      const response = await api.get(`/contact/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mensaje:', error);
      throw error;
    }
  }

  // Actualizar estado del mensaje (admin)
  async updateMessageStatus(messageId, status) {
    try {
      const response = await api.patch(`/contact/${messageId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado del mensaje:', error);
      throw error;
    }
  }

  // Eliminar mensaje (admin)
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/contact/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      throw error;
    }
  }
}

export default new ContactService();