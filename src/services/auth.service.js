import api from './api';
import { API_ENDPOINTS } from '../config/api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, {
        email,
        password
      });
      
      if (response.success && response.data) {
        // Guardar el usuario y token
        const userData = {
          ...response.data.user,
          token: response.data.token
        };
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      return { success: false, error: response.message || 'Error al iniciar sesión' };
    } catch (error) {
      return { success: false, error: error.message || 'Error de conexión' };
    }
  }

  async logout() {
    try {
      await api.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('adminUser');
    }
  }

  async refreshToken() {
    try {
      const response = await api.post(API_ENDPOINTS.auth.refresh);
      if (response.success && response.data.token) {
        const currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        const updatedUser = {
          ...currentUser,
          token: response.data.token
        };
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.auth.me);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  isAuthenticated() {
    const user = localStorage.getItem('adminUser');
    return !!user;
  }

  getStoredUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();