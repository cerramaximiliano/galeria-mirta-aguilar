import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Image } from 'lucide-react';
import useToast from '../../hooks/useToast';
import useArtworksStore from '../../store/artworksStore';

const AdminDigitalArtModal = ({ isOpen, onClose, artwork, onSuccess }) => {
  const toast = useToast();
  const { artworks, fetchArtworks } = useArtworksStore();
  
  const initialFormData = {
    title: '',
    originalArtworkId: '',
    originalTitle: '',
    artist: 'Mirta Susana Aguilar',
    version: '01',
    description: '',
    digitalTechnique: 'Reinterpretación digital',
    imageUrl: '',
    thumbnailUrl: '',
    mockupUrl: '',
    productType: 'lamina',
    sizes: [
      {
        size: 'A4',
        dimensions: '21 x 29.7 cm',
        price: 15000,
        currency: 'ARS',
        available: true
      },
      {
        size: 'A3',
        dimensions: '29.7 x 42 cm',
        price: 25000,
        currency: 'ARS',
        available: true
      },
      {
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
    tags: [],
    available: true,
    featured: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (artworks.length === 0) {
      fetchArtworks({ limit: 100 });
    }
  }, [artworks, fetchArtworks]);
  
  // Debug: ver estructura de las obras
  useEffect(() => {
    if (artworks.length > 0) {
      console.log('Obras disponibles:', artworks[0]);
    }
  }, [artworks]);

  useEffect(() => {
    if (artwork) {
      setFormData({
        ...artwork,
        // Si originalArtworkId es un objeto (populate), tomar el _id
        originalArtworkId: artwork.originalArtworkId?._id || artwork.originalArtworkId || '',
        // Si originalTitle no existe pero originalArtworkId es un objeto, tomar el title
        originalTitle: artwork.originalTitle || artwork.originalArtworkId?.title || '',
        sizes: artwork.sizes || initialFormData.sizes,
        features: artwork.features || initialFormData.features,
        tags: artwork.tags || []
      });
    } else {
      setFormData(initialFormData);
    }
  }, [artwork]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'price' ? Number(value) : field === 'available' ? value : value
    };
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, {
        size: '',
        dimensions: '',
        price: 0,
        currency: 'ARS',
        available: true
      }]
    }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleOriginalArtworkChange = (e) => {
    const selectedArtworkId = e.target.value;
    // Buscar por _id o por id (por si el store usa id en lugar de _id)
    const selectedArtwork = artworks.find(a => (a._id === selectedArtworkId) || (a.id === selectedArtworkId));
    
    console.log('Obra seleccionada:', {
      id: selectedArtworkId,
      artwork: selectedArtwork,
      title: selectedArtwork?.title,
      allArtworks: artworks.length
    });
    
    setFormData(prev => ({
      ...prev,
      originalArtworkId: selectedArtworkId,
      originalTitle: selectedArtwork ? selectedArtwork.title : ''
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('FormData al enviar:', formData);
      
      // Validaciones
      if (!formData.originalArtworkId) {
        throw new Error('Debes seleccionar una obra original');
      }
      
      // Si no hay originalTitle, intentar obtenerlo de las obras
      let finalOriginalTitle = formData.originalTitle;
      if (!finalOriginalTitle) {
        const selectedArtwork = artworks.find(a => 
          (a._id === formData.originalArtworkId) || 
          (a.id === formData.originalArtworkId)
        );
        if (selectedArtwork) {
          finalOriginalTitle = selectedArtwork.title;
        }
      }
      
      if (!finalOriginalTitle) {
        console.error('No se pudo obtener el título de la obra original:', {
          originalTitle: formData.originalTitle,
          originalArtworkId: formData.originalArtworkId,
          artworksLength: artworks.length
        });
        throw new Error('No se pudo obtener el título de la obra original');
      }

      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const token = adminUser.token;
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
      }
      
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';
      
      const url = artwork 
        ? `${apiUrl}/digital-art/${artwork._id}`
        : `${apiUrl}/digital-art`;
      
      const method = artwork ? 'PUT' : 'POST';

      // Preparar los datos para enviar
      const dataToSubmit = {
        ...formData,
        // Asegurar que originalArtworkId siempre sea el _id (string)
        originalArtworkId: formData.originalArtworkId,
        // Asegurar que originalTitle esté presente
        originalTitle: finalOriginalTitle
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al guardar la obra digital');
      }

      toast.success(artwork ? 'Obra digital actualizada' : 'Obra digital creada');
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al guardar la obra digital');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-auto my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gallery-200">
          <h2 className="text-xl font-serif font-bold text-gallery-900">
            {artwork ? 'Editar Obra Digital' : 'Nueva Obra Digital'}
          </h2>
          <button
            onClick={onClose}
            className="btn-icon text-gallery-600 hover:text-gallery-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content with scrollable area */}
        <form onSubmit={handleSubmit} id={artwork ? 'edit-digital-art-form' : 'create-digital-art-form'} className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Título de la versión digital *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                placeholder="Ej: Los Reyes - Versión Digital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Obra original *
              </label>
              <select
                name="originalArtworkId"
                value={formData.originalArtworkId}
                onChange={handleOriginalArtworkChange}
                required
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              >
                <option value="">Seleccionar obra original</option>
                {artworks.map((artwork) => (
                  <option key={artwork._id || artwork.id} value={artwork._id || artwork.id}>
                    {artwork.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Versión
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                placeholder="01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Técnica digital
              </label>
              <input
                type="text"
                name="digitalTechnique"
                value={formData.digitalTechnique}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                placeholder="Reinterpretación digital"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              placeholder="Describe la reinterpretación digital..."
            />
          </div>

          {/* URLs de imágenes */}
          <div className="space-y-4">
            <h4 className="font-medium text-gallery-900 flex items-center gap-2">
              <Image className="h-5 w-5" />
              Imágenes
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  URL de imagen principal *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  URL de miniatura
                </label>
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  URL de mockup
                </label>
                <input
                  type="url"
                  name="mockupUrl"
                  value={formData.mockupUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Tamaños y precios */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gallery-900">Tamaños y Precios</h4>
              <button
                type="button"
                onClick={addSize}
                className="btn-secondary text-sm"
              >
                <Plus className="h-4 w-4" />
                Agregar tamaño
              </button>
            </div>

            <div className="space-y-3">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={size.size}
                      onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                      placeholder="Tamaño (A4)"
                      className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                    />
                    <input
                      type="text"
                      value={size.dimensions}
                      onChange={(e) => handleSizeChange(index, 'dimensions', e.target.value)}
                      placeholder="21 x 29.7 cm"
                      className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                    />
                    <input
                      type="number"
                      value={size.price}
                      onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                      placeholder="Precio"
                      className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={size.available}
                        onChange={(e) => handleSizeChange(index, 'available', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Disponible</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="btn-icon text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Características */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Tipo de papel
              </label>
              <input
                type="text"
                name="features.paperType"
                value={formData.features.paperType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Tipo de impresión
              </label>
              <input
                type="text"
                name="features.printing"
                value={formData.features.printing}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Edición
              </label>
              <input
                type="text"
                name="features.edition"
                value={formData.features.edition}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="features.signedAvailable"
                  checked={formData.features.signedAvailable}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gallery-700">
                  Firma disponible
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gallery-700 mb-1">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Agregar etiqueta"
                className="flex-1 px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gallery-100 text-gallery-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-gallery-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Estados */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Disponible
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Destacada
              </span>
            </label>
          </div>

          </div>
        </form>

        {/* Footer con botones */}
        <div className="border-t border-gallery-200 p-6 bg-gallery-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (artwork ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDigitalArtModal;