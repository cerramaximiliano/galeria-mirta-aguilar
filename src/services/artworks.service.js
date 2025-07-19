import api from './api';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

// Por ahora, mantenemos los datos hardcodeados
import artworksData from '../data/artworks.json';

class ArtworksService {
  constructor() {
    // Cambiar a false para usar la API real
    this.useMockData = false;
    console.log('🎨 ArtworksService inicializado');
    console.log(`📡 Modo: ${this.useMockData ? 'DATOS LOCALES (JSON)' : 'API BACKEND'}`);
    console.log(`🌐 API URL: ${this.useMockData ? 'N/A - Usando JSON local' : API_BASE_URL}`);
  }

  // Obtener todas las obras (con filtros)
  async getArtworks(params = {}) {
    console.log('🔍 getArtworks llamado con params:', params);
    
    try {
      if (this.useMockData) {
        // Usar datos locales
        console.log('📂 Usando DATOS LOCALES del archivo JSON');
        console.log(`📊 Total de obras en JSON: ${artworksData.length}`);
        let filteredArtworks = [...artworksData].map(artwork => ({
          ...artwork,
          currency: artwork.currency || 'ARS'
        }));
        
        // Aplicar filtros localmente
        if (params.category && params.category !== 'todos') {
          filteredArtworks = filteredArtworks.filter(a => a.category === params.category);
        }
        
        if (params.search) {
          const searchTerm = params.search.toLowerCase();
          filteredArtworks = filteredArtworks.filter(a => 
            a.title.toLowerCase().includes(searchTerm) ||
            a.description.toLowerCase().includes(searchTerm)
          );
        }
        
        if (params.available !== undefined) {
          filteredArtworks = filteredArtworks.filter(a => a.available === params.available);
        }
        
        // Aplicar ordenamiento
        if (params.sort) {
          switch (params.sort) {
            case 'price_asc':
              filteredArtworks.sort((a, b) => a.price - b.price);
              break;
            case 'price_desc':
              filteredArtworks.sort((a, b) => b.price - a.price);
              break;
            case 'newest':
              filteredArtworks.sort((a, b) => b.id - a.id);
              break;
            case 'oldest':
              filteredArtworks.sort((a, b) => a.id - b.id);
              break;
          }
        }
        
        // Aplicar paginación
        const limit = params.limit || 20;
        const offset = params.offset || 0;
        const paginatedArtworks = filteredArtworks.slice(offset, offset + limit);
        
        return {
          success: true,
          data: paginatedArtworks,
          pagination: {
            total: filteredArtworks.length,
            limit,
            offset,
            pages: Math.ceil(filteredArtworks.length / limit),
            currentPage: Math.floor(offset / limit) + 1
          }
        };
      } else {
        // Usar API real
        console.log('🌐 Llamando a la API BACKEND...');
        console.log(`🔗 URL: ${API_BASE_URL}${API_ENDPOINTS.artworks.list}`);
        
        const response = await api.get(API_ENDPOINTS.artworks.list, params);
        
        console.log('✅ Respuesta de la API recibida:');
        console.log(`📊 Success: ${response.success}`);
        console.log(`📊 Total de obras: ${response.data?.length || 0}`);
        console.log(`📄 Paginación:`, response.pagination);
        
        return response;
      }
    } catch (error) {
      console.error('❌ Error al obtener obras:', error);
      console.error('🔍 Detalles del error:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw error;
    }
  }

  // Obtener una obra por ID
  async getArtworkById(id) {
    console.log(`🔍 getArtworkById llamado con ID: ${id}`);
    
    try {
      if (this.useMockData) {
        // Usar datos locales
        console.log('📂 Buscando en DATOS LOCALES del archivo JSON');
        const artwork = artworksData.find(a => a.id === parseInt(id));
        
        if (!artwork) {
          throw new Error('Obra no encontrada');
        }
        
        return {
          success: true,
          data: artwork
        };
      } else {
        // Usar API real
        console.log('🌐 Llamando a la API BACKEND para obtener obra...');
        console.log(`🔗 URL: ${API_BASE_URL}${API_ENDPOINTS.artworks.detail(id)}`);
        
        const response = await api.get(API_ENDPOINTS.artworks.detail(id));
        
        console.log('✅ Obra obtenida de la API:');
        console.log(`📊 Success: ${response.success}`);
        console.log(`🎨 Título: ${response.data?.title || 'N/A'}`);
        
        return response;
      }
    } catch (error) {
      console.error('Error al obtener obra:', error);
      throw error;
    }
  }

  // Crear nueva obra (admin)
  async createArtwork(artworkData, isFormData = false) {
    console.log('🎨 createArtwork llamado con isFormData:', isFormData);
    
    try {
      let response;
      if (isFormData) {
        // Enviar como FormData
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        const token = adminUser.token;
        
        console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
        console.log('👤 Usuario admin:', adminUser.email || 'No disponible');
        
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }
        
        console.log('📤 Enviando FormData a:', `${API_BASE_URL}${API_ENDPOINTS.artworks.create}`);
        
        const rawResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.artworks.create}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: artworkData
        });
        
        console.log('📥 Respuesta del servidor:', rawResponse.status, rawResponse.statusText);
        
        response = await rawResponse.json();
        
        if (!rawResponse.ok) {
          console.error('❌ Error en la respuesta:', response);
          throw new Error(response.message || 'Error al crear obra');
        }
      } else {
        // Enviar como JSON
        response = await api.post(API_ENDPOINTS.artworks.create, artworkData);
      }
      return response;
    } catch (error) {
      console.error('Error al crear obra:', error);
      throw error;
    }
  }

  // Actualizar obra (admin)
  async updateArtwork(id, artworkData) {
    try {
      const response = await api.put(API_ENDPOINTS.artworks.update(id), artworkData);
      return response;
    } catch (error) {
      console.error('Error al actualizar obra:', error);
      throw error;
    }
  }

  // Eliminar obra (admin)
  async deleteArtwork(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.artworks.delete(id));
      return response;
    } catch (error) {
      console.error('Error al eliminar obra:', error);
      throw error;
    }
  }

  // Cambiar estado de disponibilidad (admin)
  async updateArtworkStatus(id, status) {
    try {
      const response = await api.patch(API_ENDPOINTS.artworks.updateStatus(id), status);
      return response;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  async getStats() {
    console.log('📊 getStats llamado');
    
    try {
      if (this.useMockData) {
        // Calcular localmente
        console.log('📂 Calculando estadísticas desde DATOS LOCALES');
        const total = artworksData.length;
        const available = artworksData.filter(a => a.available).length;
        const sold = artworksData.filter(a => !a.available).length;
        const totalValue = artworksData.reduce((sum, a) => sum + a.price, 0);
        
        return {
          success: true,
          data: {
            total,
            available,
            sold,
            totalValue
          }
        };
      } else {
        // Usar API real
        console.log('🌐 Llamando a la API BACKEND para estadísticas...');
        console.log(`🔗 URL: ${API_BASE_URL}${API_ENDPOINTS.stats.artworks}`);
        
        const response = await api.get(API_ENDPOINTS.stats.artworks);
        
        console.log('✅ Estadísticas obtenidas de la API:');
        console.log('📊 Data:', response.data);
        
        return response;
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export default new ArtworksService();