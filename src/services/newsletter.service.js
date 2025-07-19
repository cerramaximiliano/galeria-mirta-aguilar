import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Datos mock para desarrollo
const mockSubscribers = [
  {
    id: 1,
    email: 'juan@example.com',
    name: 'Juan Pérez',
    status: 'active',
    subscribedAt: '2024-01-10T10:00:00Z',
    tags: ['art-lover', 'collector']
  },
  {
    id: 2,
    email: 'maria@example.com',
    name: 'María García',
    status: 'active',
    subscribedAt: '2024-01-15T14:30:00Z',
    tags: ['newsletter']
  },
  {
    id: 3,
    email: 'carlos@example.com',
    name: 'Carlos López',
    status: 'unsubscribed',
    subscribedAt: '2024-01-05T09:00:00Z',
    unsubscribedAt: '2024-01-20T11:00:00Z',
    tags: ['newsletter']
  }
];

class NewsletterService {
  // Suscribir a newsletter
  async subscribe(subscriptionData) {
    try {
      // Usar el endpoint de la API real
      const response = await api.post('/newsletter/subscribe', {
        email: subscriptionData.email,
        name: subscriptionData.name || undefined
      });
      
      // La respuesta de axios viene en response.data
      return response.data;
    } catch (error) {
      console.error('❌ Newsletter Service: Error al suscribir:', error);
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

  // Cancelar suscripción
  async unsubscribe(email) {
    try {
      // Cuando esté listo el backend:
      // const response = await api.post(API_ENDPOINTS.newsletter.unsubscribe(email));
      // return response;
      
      // Por ahora, simulamos la cancelación
      const subscriber = mockSubscribers.find(
        s => s.email === email.toLowerCase()
      );
      
      if (!subscriber) {
        return {
          success: false,
          message: 'Email no encontrado'
        };
      }
      
      if (subscriber.status === 'unsubscribed') {
        return {
          success: false,
          message: 'Este email ya está dado de baja'
        };
      }
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      subscriber.status = 'unsubscribed';
      subscriber.unsubscribedAt = new Date().toISOString();
      
      return {
        success: true,
        message: 'Suscripción cancelada correctamente'
      };
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      throw error;
    }
  }

  // Obtener lista de suscriptores (admin)
  async getSubscribers(params = {}) {
    try {
      // Cuando esté listo el backend:
      // const response = await api.get(API_ENDPOINTS.newsletter.subscribers, params);
      // return response;
      
      // Por ahora, usamos datos mock
      let filteredSubscribers = [...mockSubscribers];
      
      // Aplicar filtros
      if (params.status) {
        filteredSubscribers = filteredSubscribers.filter(s => s.status === params.status);
      }
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredSubscribers = filteredSubscribers.filter(s => 
          s.email.toLowerCase().includes(searchTerm) ||
          (s.name && s.name.toLowerCase().includes(searchTerm))
        );
      }
      
      if (params.tag) {
        filteredSubscribers = filteredSubscribers.filter(s => 
          s.tags && s.tags.includes(params.tag)
        );
      }
      
      // Aplicar ordenamiento
      if (params.sort) {
        switch (params.sort) {
          case 'date_desc':
            filteredSubscribers.sort((a, b) => 
              new Date(b.subscribedAt) - new Date(a.subscribedAt)
            );
            break;
          case 'date_asc':
            filteredSubscribers.sort((a, b) => 
              new Date(a.subscribedAt) - new Date(b.subscribedAt)
            );
            break;
          case 'email_asc':
            filteredSubscribers.sort((a, b) => a.email.localeCompare(b.email));
            break;
          case 'email_desc':
            filteredSubscribers.sort((a, b) => b.email.localeCompare(a.email));
            break;
        }
      }
      
      // Aplicar paginación
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const paginatedSubscribers = filteredSubscribers.slice(offset, offset + limit);
      
      return {
        success: true,
        data: paginatedSubscribers,
        pagination: {
          total: filteredSubscribers.length,
          limit,
          offset,
          pages: Math.ceil(filteredSubscribers.length / limit),
          currentPage: Math.floor(offset / limit) + 1
        }
      };
    } catch (error) {
      console.error('Error al obtener suscriptores:', error);
      throw error;
    }
  }

  // Validar datos de suscripción
  validateSubscriptionData(data) {
    const errors = {};
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Email inválido';
    }
    
    // Validar nombre (opcional)
    if (data.name && data.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar consentimiento
    if (!data.consent) {
      errors.consent = 'Debes aceptar la política de privacidad';
    }
    
    return errors;
  }

  // Obtener estadísticas del newsletter (admin)
  async getStats() {
    try {
      // Por ahora calculamos localmente
      const total = mockSubscribers.length;
      const active = mockSubscribers.filter(s => s.status === 'active').length;
      const unsubscribed = mockSubscribers.filter(s => s.status === 'unsubscribed').length;
      
      // Calcular crecimiento mensual
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const newThisMonth = mockSubscribers.filter(s => 
        new Date(s.subscribedAt) >= thisMonth
      ).length;
      
      return {
        success: true,
        data: {
          total,
          active,
          unsubscribed,
          newThisMonth,
          growthRate: total > 0 ? ((newThisMonth / total) * 100).toFixed(1) : 0
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Exportar lista de suscriptores (admin)
  async exportSubscribers(format = 'csv') {
    try {
      const subscribers = await this.getSubscribers({ status: 'active', limit: 1000 });
      
      if (format === 'csv') {
        const headers = ['Email', 'Nombre', 'Fecha de suscripción'];
        const rows = subscribers.data.map(s => [
          s.email,
          s.name || '',
          new Date(s.subscribedAt).toLocaleDateString()
        ]);
        
        const csv = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return {
          success: true,
          data: csv,
          filename: `suscriptores_${new Date().toISOString().split('T')[0]}.csv`
        };
      }
      
      return {
        success: false,
        message: 'Formato no soportado'
      };
    } catch (error) {
      console.error('Error al exportar suscriptores:', error);
      throw error;
    }
  }
}

export default new NewsletterService();