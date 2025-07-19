import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Datos hardcodeados temporales para desarrollo
const mockOrders = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+34 600 123 456'
    },
    items: [
      {
        id: 1,
        artworkId: 1,
        title: 'Atardecer en la Bahía',
        price: 1200,
        quantity: 1
      }
    ],
    total: 1200,
    status: 'completed',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Calle Mayor 123',
      city: 'Madrid',
      postalCode: '28001',
      country: 'España'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'María García',
      email: 'maria@example.com',
      phone: '+34 610 234 567'
    },
    items: [
      {
        id: 2,
        artworkId: 3,
        title: 'Abstracción en Azul',
        price: 2500,
        quantity: 1
      }
    ],
    total: 2500,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      street: 'Avenida Diagonal 456',
      city: 'Barcelona',
      postalCode: '08001',
      country: 'España'
    },
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-20T15:45:00Z'
  }
];

class OrdersService {
  // Crear nueva orden
  async createOrder(orderData) {
    try {
      // Cuando esté listo el backend:
      // const response = await api.post(API_ENDPOINTS.orders.create, orderData);
      // return response;
      
      // Por ahora, simulamos la creación
      const newOrder = {
        id: mockOrders.length + 1,
        orderNumber: `ORD-2024-${String(mockOrders.length + 1).padStart(3, '0')}`,
        ...orderData,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockOrders.push(newOrder);
      
      return {
        success: true,
        data: newOrder
      };
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  }

  // Obtener todas las órdenes (con filtros)
  async getOrders(params = {}) {
    try {
      // Cuando esté listo el backend:
      // const response = await api.get(API_ENDPOINTS.orders.list, params);
      // return response;
      
      // Por ahora, usamos datos hardcodeados
      let filteredOrders = [...mockOrders];
      
      // Aplicar filtros
      if (params.status) {
        filteredOrders = filteredOrders.filter(o => o.status === params.status);
      }
      
      if (params.paymentStatus) {
        filteredOrders = filteredOrders.filter(o => o.paymentStatus === params.paymentStatus);
      }
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredOrders = filteredOrders.filter(o => 
          o.orderNumber.toLowerCase().includes(searchTerm) ||
          o.customer.name.toLowerCase().includes(searchTerm) ||
          o.customer.email.toLowerCase().includes(searchTerm)
        );
      }
      
      // Aplicar ordenamiento
      if (params.sort) {
        switch (params.sort) {
          case 'date_desc':
            filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'date_asc':
            filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'total_desc':
            filteredOrders.sort((a, b) => b.total - a.total);
            break;
          case 'total_asc':
            filteredOrders.sort((a, b) => a.total - b.total);
            break;
        }
      }
      
      // Aplicar paginación
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const paginatedOrders = filteredOrders.slice(offset, offset + limit);
      
      return {
        success: true,
        data: paginatedOrders,
        pagination: {
          total: filteredOrders.length,
          limit,
          offset,
          pages: Math.ceil(filteredOrders.length / limit),
          currentPage: Math.floor(offset / limit) + 1
        }
      };
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }
  }

  // Obtener una orden por ID
  async getOrderById(id) {
    try {
      // Cuando esté listo el backend:
      // const response = await api.get(API_ENDPOINTS.orders.detail(id));
      // return response;
      
      // Por ahora, usamos datos hardcodeados
      const order = mockOrders.find(o => o.id === parseInt(id));
      
      if (!order) {
        throw new Error('Orden no encontrada');
      }
      
      return {
        success: true,
        data: order
      };
    } catch (error) {
      console.error('Error al obtener orden:', error);
      throw error;
    }
  }

  // Actualizar estado de orden
  async updateOrderStatus(id, status) {
    try {
      const response = await api.patch(API_ENDPOINTS.orders.updateStatus(id), { status });
      return response;
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      throw error;
    }
  }

  // Obtener estadísticas de órdenes
  async getOrderStats() {
    try {
      // Por ahora calculamos localmente
      const total = mockOrders.length;
      const pending = mockOrders.filter(o => o.status === 'pending').length;
      const processing = mockOrders.filter(o => o.status === 'processing').length;
      const completed = mockOrders.filter(o => o.status === 'completed').length;
      const cancelled = mockOrders.filter(o => o.status === 'cancelled').length;
      const totalRevenue = mockOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0);
      
      return {
        success: true,
        data: {
          total,
          pending,
          processing,
          completed,
          cancelled,
          totalRevenue
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de órdenes:', error);
      throw error;
    }
  }
}

export default new OrdersService();