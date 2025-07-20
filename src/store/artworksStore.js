import { create } from 'zustand';
import artworksService from '../services/artworks.service';
import artworksData from '../data/artworks.json';

const useArtworksStore = create((set, get) => ({
  artworks: artworksData,
  filteredArtworks: artworksData,
  selectedCategory: 'todos',
  searchTerm: '',
  loading: false,
  error: null,
  categories: [], // Categorías dinámicas desde el backend
  
  // Cargar obras desde la API
  fetchArtworks: async (params = {}) => {
    console.log('🏪 Store: fetchArtworks iniciado');
    set({ loading: true, error: null });
    try {
      const response = await artworksService.getArtworks(params);
      console.log('🏪 Store: Respuesta recibida del servicio');
      console.log('📊 Response success:', response.success);
      console.log('📊 Response data length:', response.data?.length);
      
      if (response.success) {
        // Mapear los datos de la API al formato esperado por el frontend
        console.log('🔄 Store: Mapeando datos de la API...');
        const mappedData = response.data.map((artwork, index) => {
          console.log(`🎨 Mapeando obra ${index + 1}:`, {
            id: artwork._id,
            title: artwork.title,
            featured: artwork.featured,
            hasImage: !!artwork.images?.main?.url
          });
          
          return {
            id: artwork._id,
            title: artwork.title,
            artist: artwork.artist,
            year: artwork.year,
            technique: artwork.technique,
            dimensions: artwork.dimensions,
            price: artwork.pricing.finalPrice,
            currency: artwork.pricing.currency || 'ARS',
            imageUrl: artwork.images.main.url,
            thumbnailUrl: artwork.images.thumbnail.url,
            description: artwork.description,
            available: artwork.status.isAvailable,
            sold: artwork.status.isSold,
            category: artwork.category,
            featured: artwork.featured,
            discountPercentage: artwork.pricing.discount || 0,
            tags: artwork.tags || []
          };
        });
        
        console.log('✅ Store: Datos mapeados exitosamente');
        console.log(`📊 Total de obras mapeadas: ${mappedData.length}`);
        console.log(`🌟 Obras destacadas: ${mappedData.filter(a => a.featured).length}`);
        
        // Extraer categorías únicas desde los datos del backend
        const uniqueCategories = [...new Set(mappedData.map(artwork => artwork.category))]
          .filter(category => category) // Filtrar valores null/undefined
          .sort(); // Ordenar alfabéticamente
        
        console.log('📁 Categorías encontradas:', uniqueCategories);
        
        set({ 
          artworks: mappedData,
          filteredArtworks: mappedData,
          categories: uniqueCategories,
          loading: false 
        });
        
        console.log('💾 Store: Estado actualizado correctamente');
      } else {
        console.log('⚠️ Store: Response.success es false');
        set({ error: 'Error al cargar las obras', loading: false });
      }
    } catch (error) {
      console.error('❌ Store: Error en fetchArtworks:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().filterArtworks();
  },
  
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().filterArtworks();
  },
  
  filterArtworks: () => {
    const { artworks, selectedCategory, searchTerm } = get();
    
    let filtered = artworks;
    
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(artwork => artwork.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    set({ filteredArtworks: filtered });
  },
  
  getArtworkById: (id) => {
    return get().artworks.find(artwork => artwork.id === id || artwork.id === parseInt(id));
  },
  
  // Métodos para administración
  createArtwork: async (artworkData, isFormData = false) => {
    try {
      const response = await artworksService.createArtwork(artworkData, isFormData);
      if (response.success) {
        // Recargar las obras con el mismo límite
        await get().fetchArtworks({ limit: 100 });
        return response;
      }
    } catch (error) {
      throw error;
    }
  },
  
  updateArtwork: async (id, artworkData) => {
    try {
      const response = await artworksService.updateArtwork(id, artworkData);
      if (response.success) {
        // Recargar las obras con el mismo límite
        await get().fetchArtworks({ limit: 100 });
        return response;
      }
    } catch (error) {
      throw error;
    }
  },
  
  deleteArtwork: async (id) => {
    try {
      const response = await artworksService.deleteArtwork(id);
      if (response.success) {
        // Actualizar localmente
        const updatedArtworks = get().artworks.filter(a => a.id !== id && a.id !== parseInt(id));
        set({ artworks: updatedArtworks });
        get().filterArtworks();
        return response;
      }
    } catch (error) {
      throw error;
    }
  },
  
  updateArtworkStatus: async (id, status) => {
    try {
      const response = await artworksService.updateArtworkStatus(id, status);
      if (response.success) {
        // Actualizar localmente
        const updatedArtworks = get().artworks.map(a => 
          (a.id === id || a.id === parseInt(id)) ? { ...a, ...status } : a
        );
        set({ artworks: updatedArtworks });
        get().filterArtworks();
        return response;
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener categorías para mostrar en los filtros
  getCategories: () => {
    const categories = get().categories;
    return [
      { value: 'todos', label: 'Todas las Obras' },
      ...categories.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1) // Capitalizar primera letra
      }))
    ];
  }
}));

export default useArtworksStore;