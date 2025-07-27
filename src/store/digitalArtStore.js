import { create } from 'zustand';

// Mock data para desarrollo
const mockDigitalArt = [
  {
    id: 'digital-001',
    title: 'Los Reyes - Versión Digital',
    originalArtworkId: '687cc12a14b35ed5f26563f2',
    originalTitle: 'Los Reyes',
    artist: 'Mirta Susana Aguilar',
    version: '01',
    description: 'Reinterpretación digital de la obra original "Los Reyes". Esta versión contemporánea mantiene la esencia y el poder visual del cuadro original, adaptado para un público joven que busca arte accesible y moderno para decorar sus espacios.',
    digitalTechnique: 'Reinterpretación digital con técnicas mixtas',
    imageUrl: 'https://res.cloudinary.com/dqyoeolib/image/upload/v1753545958/Los_Reyes_digital_01_vqbrmz.png',
    thumbnailUrl: 'https://res.cloudinary.com/dqyoeolib/image/upload/c_thumb,w_400/v1753545958/Los_Reyes_digital_01_vqbrmz.png',
    mockupUrl: null,
    productType: 'lamina',
    sizes: [
      {
        id: 'size-a4',
        size: 'A4',
        dimensions: '21 x 29.7 cm',
        price: 15000,
        currency: 'ARS',
        available: true
      },
      {
        id: 'size-a3',
        size: 'A3',
        dimensions: '29.7 x 42 cm',
        price: 25000,
        currency: 'ARS',
        available: true
      },
      {
        id: 'size-a2',
        size: 'A2',
        dimensions: '42 x 59.4 cm',
        price: 35000,
        currency: 'ARS',
        available: true
      }
    ],
    features: {
      paperType: 'Papel fotográfico premium 250g',
      printing: 'Impresión giclée de alta calidad',
      edition: 'Edición abierta',
      signedAvailable: true
    },
    category: 'digital',
    tags: ['reinterpretación', 'moderno', 'decorativo', 'juvenil'],
    available: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const useDigitalArtStore = create((set, get) => ({
  digitalArtworks: [],
  loading: false,
  error: null,
  selectedSize: null,

  // Fetch single digital artwork by ID
  fetchDigitalArtworkById: async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';
      console.log('🎨 Arte Digital: Intentando cargar obra específica:', id);
      
      const response = await fetch(`${apiUrl}/digital-art/${id}`);
      
      if (!response.ok) {
        throw new Error('Obra no encontrada');
      }
      
      const data = await response.json();
      console.log('🎨 Arte Digital: Obra específica recibida:', data);
      
      if (data.success && data.data) {
        // Agregar la obra a la lista si no existe
        const { digitalArtworks } = get();
        const exists = digitalArtworks.find(a => a._id === data.data._id || a.id === data.data._id);
        if (!exists) {
          set({ digitalArtworks: [...digitalArtworks, data.data] });
        }
        return data.data;
      }
    } catch (error) {
      console.error('Error al cargar obra digital:', error);
      // Si falla, intentar con mock data
      const mockArtwork = mockDigitalArt.find(a => a.id === id);
      if (mockArtwork) {
        const { digitalArtworks } = get();
        const exists = digitalArtworks.find(a => a.id === mockArtwork.id);
        if (!exists) {
          set({ digitalArtworks: [...digitalArtworks, mockArtwork] });
        }
        return mockArtwork;
      }
      return null;
    }
  },

  // Fetch digital artworks
  fetchDigitalArtworks: async (options = {}) => {
    set({ loading: true, error: null });
    
    try {
      // Intenta cargar desde el servidor
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';
      console.log('🎨 Arte Digital: Intentando cargar desde:', `${apiUrl}/digital-art`);
      
      const response = await fetch(`${apiUrl}/digital-art?limit=${options.limit || 20}`);
      
      if (!response.ok) {
        throw new Error('API no disponible');
      }
      
      const data = await response.json();
      console.log('🎨 Arte Digital: Respuesta del servidor:', data);
      
      if (data.success && data.data) {
        console.log('🎨 Arte Digital: Cargando datos del servidor, cantidad:', data.data.length);
        console.log('🎨 Arte Digital: Primer elemento:', data.data[0]);
        console.log('🎨 Arte Digital: IDs de las obras:', data.data.map(item => ({ _id: item._id, id: item.id })));
        set({ digitalArtworks: data.data, loading: false });
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.log('📌 Arte digital: Usando datos mock (servidor no disponible)', error.message);
      console.log('📌 Mock data:', mockDigitalArt);
      // Si falla, usa los datos mock
      set({ 
        digitalArtworks: mockDigitalArt, 
        loading: false,
        error: null // No mostramos error si tenemos datos mock
      });
    }
  },

  // Get digital artwork by ID
  getDigitalArtworkById: (id) => {
    const { digitalArtworks } = get();
    console.log('getDigitalArtworkById:', {
      searchingFor: id,
      totalArtworks: digitalArtworks.length,
      artworkIds: digitalArtworks.map(a => ({ _id: a._id, id: a.id }))
    });
    const found = digitalArtworks.find(artwork => artwork.id === id || artwork._id === id);
    console.log('Found artwork:', found);
    return found;
  },

  // Set selected size for a digital artwork
  setSelectedSize: (artworkId, sizeId) => {
    set({ selectedSize: { artworkId, sizeId } });
  },

  // Get selected size for a digital artwork
  getSelectedSize: (artworkId) => {
    const { selectedSize } = get();
    if (selectedSize?.artworkId === artworkId) {
      return selectedSize.sizeId;
    }
    // Return first available size as default
    const artwork = get().getDigitalArtworkById(artworkId);
    return artwork?.sizes.find(s => s.available)?.id;
  },

  // Calculate price for selected size
  getPriceForSize: (artworkId, sizeId) => {
    const artwork = get().getDigitalArtworkById(artworkId);
    if (!artwork || !artwork.sizes) return null;
    
    // Buscar por id, _id o por índice generado
    const size = artwork.sizes.find((s, index) => 
      s.id === sizeId || 
      s._id === sizeId || 
      `size-${index}` === sizeId
    );
    
    return size || artwork.sizes[0]; // Default to first size
  },

  // Check if using mock data
  isUsingMockData: () => {
    const { digitalArtworks } = get();
    return digitalArtworks.length > 0 && digitalArtworks[0].id === 'digital-001';
  }
}));

export default useDigitalArtStore;