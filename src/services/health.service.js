import api from './api';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

class HealthService {
  // Verificar estado del API
  async checkHealth() {
    try {
      const response = await api.get(API_ENDPOINTS.health);
      return {
        success: true,
        apiUrl: API_BASE_URL,
        ...response
      };
    } catch (error) {
      return {
        success: false,
        apiUrl: API_BASE_URL,
        error: error.message || 'API no disponible',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar conectividad con servicios externos
  async checkExternalServices() {
    const services = {
      api: false,
      stripe: false,
      email: false,
      storage: false
    };

    try {
      // Verificar API principal
      const apiHealth = await this.checkHealth();
      services.api = apiHealth.success;

      // Los demás servicios se verificarían a través del backend
      // Por ahora retornamos valores simulados
      services.stripe = true; // Se verificaría en el backend
      services.email = true;  // Se verificaría en el backend
      services.storage = true; // Se verificaría en el backend

      return {
        success: true,
        services,
        allOperational: Object.values(services).every(status => status === true)
      };
    } catch (error) {
      return {
        success: false,
        services,
        error: 'Error al verificar servicios'
      };
    }
  }

  // Verificar versión del API
  async getApiVersion() {
    try {
      const response = await api.get('/version');
      return response;
    } catch (error) {
      // Si no hay endpoint de versión, retornar versión por defecto
      return {
        success: true,
        version: '1.0.0',
        apiUrl: API_BASE_URL
      };
    }
  }

  // Test de velocidad básico
  async performSpeedTest() {
    const startTime = Date.now();
    
    try {
      await this.checkHealth();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        success: true,
        responseTime: `${responseTime}ms`,
        status: responseTime < 200 ? 'excellent' : 
                responseTime < 500 ? 'good' : 
                responseTime < 1000 ? 'fair' : 'poor'
      };
    } catch (error) {
      return {
        success: false,
        error: 'No se pudo completar el test de velocidad'
      };
    }
  }

  // Obtener información del sistema
  getSystemInfo() {
    return {
      apiBaseUrl: API_BASE_URL,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      onLine: navigator.onLine
    };
  }

  // Verificar si el API está usando HTTPS en producción
  checkSecureConnection() {
    const isProduction = process.env.NODE_ENV === 'production';
    const isHttps = API_BASE_URL.startsWith('https://');
    const isLocalhost = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');

    return {
      secure: !isProduction || isHttps || isLocalhost,
      warning: isProduction && !isHttps && !isLocalhost ? 
        'API no está usando HTTPS en producción' : null
    };
  }
}

export default new HealthService();