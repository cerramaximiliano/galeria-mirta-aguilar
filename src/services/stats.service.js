import api from './api';
import { API_ENDPOINTS } from '../config/api';
import artworksService from './artworks.service';
import ordersService from './orders.service';
import newsletterService from './newsletter.service';

class StatsService {
  // Obtener estadísticas del dashboard
  async getDashboardStats() {
    try {
      // Cuando esté listo el backend:
      // const response = await api.get(API_ENDPOINTS.stats.dashboard);
      // return response;
      
      // Por ahora, agregamos datos de diferentes servicios
      const [artworkStats, orderStats, newsletterStats] = await Promise.all([
        artworksService.getStats(),
        ordersService.getOrderStats(),
        newsletterService.getStats()
      ]);
      
      return {
        success: true,
        data: {
          artworks: artworkStats.data,
          orders: orderStats.data,
          newsletter: newsletterStats.data,
          summary: {
            totalRevenue: orderStats.data.totalRevenue,
            totalArtworks: artworkStats.data.total,
            totalOrders: orderStats.data.total,
            totalSubscribers: newsletterStats.data.active
          }
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  }

  // Obtener estadísticas de ventas
  async getSalesStats(params = {}) {
    try {
      // Cuando esté listo el backend:
      // const response = await api.get(API_ENDPOINTS.stats.sales, params);
      // return response;
      
      // Por ahora, generamos datos mock
      const period = params.period || 'month'; // day, week, month, year
      const startDate = params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = params.endDate || new Date();
      
      // Generar datos de ventas simulados
      const salesData = this.generateSalesData(startDate, endDate, period);
      
      return {
        success: true,
        data: {
          period,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          sales: salesData.sales,
          revenue: salesData.revenue,
          averageOrderValue: salesData.averageOrderValue,
          topSellingArtworks: salesData.topSellingArtworks,
          salesByCategory: salesData.salesByCategory
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de ventas:', error);
      throw error;
    }
  }

  // Obtener estadísticas de obras
  async getArtworksStats() {
    try {
      // Cuando esté listo el backend:
      // const response = await api.get(API_ENDPOINTS.stats.artworks);
      // return response;
      
      // Por ahora, generamos datos mock
      const artworkStats = await artworksService.getStats();
      
      // Agregar más detalles
      const mockStats = {
        ...artworkStats.data,
        byCategory: {
          'paisajes': 15,
          'abstracto': 10,
          'retratos': 8,
          'naturaleza-muerta': 7,
          'otros': 5
        },
        priceRanges: {
          '0-500': 10,
          '500-1000': 15,
          '1000-2000': 12,
          '2000-5000': 6,
          '5000+': 2
        },
        viewsLastMonth: 1250,
        favoriteCount: 85,
        averagePrice: 1450
      };
      
      return {
        success: true,
        data: mockStats
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de obras:', error);
      throw error;
    }
  }

  // Generar datos de ventas simulados
  generateSalesData(startDate, endDate, period) {
    const salesData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const sales = Math.floor(Math.random() * 10) + 1;
      const revenue = sales * (Math.random() * 2000 + 500);
      
      salesData.push({
        date: currentDate.toISOString().split('T')[0],
        sales,
        revenue: Math.round(revenue)
      });
      
      // Incrementar fecha según el período
      switch (period) {
        case 'day':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'week':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'month':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'year':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }
    
    const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    
    return {
      sales: salesData,
      revenue: totalRevenue,
      averageOrderValue: totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0,
      topSellingArtworks: [
        { id: 1, title: 'Atardecer en la Bahía', sales: 5, revenue: 6000 },
        { id: 3, title: 'Abstracción en Azul', sales: 3, revenue: 7500 },
        { id: 5, title: 'Jardín Secreto', sales: 2, revenue: 2400 }
      ],
      salesByCategory: {
        'paisajes': 8,
        'abstracto': 5,
        'retratos': 3,
        'naturaleza-muerta': 2,
        'otros': 1
      }
    };
  }

  // Exportar estadísticas
  async exportStats(type, format = 'csv', params = {}) {
    try {
      let data;
      
      switch (type) {
        case 'dashboard':
          data = await this.getDashboardStats();
          break;
        case 'sales':
          data = await this.getSalesStats(params);
          break;
        case 'artworks':
          data = await this.getArtworksStats();
          break;
        default:
          throw new Error('Tipo de estadística no válido');
      }
      
      if (format === 'csv') {
        const csv = this.convertToCSV(data.data);
        return {
          success: true,
          data: csv,
          filename: `estadisticas_${type}_${new Date().toISOString().split('T')[0]}.csv`
        };
      } else if (format === 'json') {
        return {
          success: true,
          data: JSON.stringify(data.data, null, 2),
          filename: `estadisticas_${type}_${new Date().toISOString().split('T')[0]}.json`
        };
      }
      
      return {
        success: false,
        message: 'Formato no soportado'
      };
    } catch (error) {
      console.error('Error al exportar estadísticas:', error);
      throw error;
    }
  }

  // Convertir datos a CSV
  convertToCSV(data) {
    // Implementación básica de conversión a CSV
    const flattenObject = (obj, prefix = '') => {
      return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return { ...acc, ...flattenObject(value, newKey) };
        }
        
        return { ...acc, [newKey]: value };
      }, {});
    };
    
    const flattened = flattenObject(data);
    const headers = Object.keys(flattened);
    const values = Object.values(flattened);
    
    return [
      headers.join(','),
      values.map(v => `"${v}"`).join(',')
    ].join('\n');
  }
}

export default new StatsService();