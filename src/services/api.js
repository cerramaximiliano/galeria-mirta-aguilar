import { API_BASE_URL } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper para obtener el token
  getAuthToken() {
    const user = localStorage.getItem('adminUser');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token;
    }
    return null;
  }

  // Helper para las peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Agregar token si existe
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Manejar error 401 (No autorizado)
      if (response.status === 401) {
        // Emitir evento personalizado para mostrar el modal
        const authEvent = new CustomEvent('auth-required', { 
          detail: { 
            retry: async () => {
              // Reintentar la petición después de re-autenticación
              return this.request(endpoint, options);
            }
          } 
        });
        window.dispatchEvent(authEvent);
        
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
      
      // Si la respuesta no es ok, lanzar error
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la petición');
      }

      // Si no hay contenido, retornar null
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos GET
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // Métodos POST
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Métodos PUT
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Métodos PATCH
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Métodos DELETE
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload de archivos
  async upload(endpoint, file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = this.getAuthToken();
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al subir el archivo');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

export default new ApiService();