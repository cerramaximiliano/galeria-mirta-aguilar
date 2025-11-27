import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader2, Image } from 'lucide-react';
import useArtworksStore from '../../store/artworksStore';

const ArtworkForm = ({ artwork, onClose, onSuccess, onError }) => {
  const { createArtwork, updateArtwork, categories } = useArtworksStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'abstracto',
    price: '',
    currency: 'ARS',
    dimensions: '',
    height: '',
    width: '',
    unit: 'cm',
    technique: '',
    year: new Date().getFullYear(),
    imageUrl: '',
    thumbnailUrl: '',
    available: true,
    sold: false,
    featured: false,
    discountPercentage: 0,
    artist: 'Mirta Aguilar',
    tags: ''
  });

  useEffect(() => {
    if (artwork) {
      // Parse dimensions if they exist (e.g., "60 x 80 cm")
      let height = '', width = '', unit = 'cm';
      if (artwork.dimensions) {
        const match = artwork.dimensions.match(/(\d+)\s*x\s*(\d+)\s*(\w+)?/i);
        if (match) {
          height = match[1];
          width = match[2];
          unit = match[3] || 'cm';
        }
      }
      
      setFormData({
        ...artwork,
        price: artwork.price.toString(),
        currency: artwork.currency || 'ARS',
        year: artwork.year || new Date().getFullYear(),
        discountPercentage: artwork.discountPercentage || 0,
        sold: !artwork.available,
        featured: artwork.featured || false,
        tags: Array.isArray(artwork.tags) ? artwork.tags.join(', ') : (artwork.tags || ''),
        height,
        width,
        unit
      });
    }
  }, [artwork]);

  // Usar categorías del backend si están disponibles, sino usar las predeterminadas
  const defaultCategories = [
    { value: 'abstracto', label: 'Abstracto' },
    { value: 'paisaje', label: 'Paisaje' },
    { value: 'retrato', label: 'Retrato' },
    { value: 'naturaleza', label: 'Naturaleza' },
    { value: 'otros', label: 'Otros' }
  ];
  
  const categoryOptions = categories && categories.length > 0
    ? categories.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    : defaultCategories;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = 'El alto debe ser mayor a 0';
    }
    
    if (!formData.width || parseFloat(formData.width) <= 0) {
      newErrors.width = 'El ancho debe ser mayor a 0';
    }
    
    if (!formData.technique.trim()) {
      newErrors.technique = 'La técnica es requerida';
    }
    
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear()) {
      newErrors.year = 'El año debe ser válido';
    }
    
    // Solo requerir imageUrl si estamos editando y no hay nueva imagen
    if (!artwork && !imageFile && !formData.imageUrl.trim()) {
      newErrors.image = 'Debe subir una imagen o proporcionar una URL';
    } else if (artwork && !imageFile && !formData.imageUrl.trim()) {
      newErrors.imageUrl = 'La URL de la imagen es requerida';
    }
    
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'El descuento debe estar entre 0 y 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar formato de imagen
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: 'Formato de imagen no válido. Use JPG, PNG o WebP.' });
        return;
      }
      
      // Validar tamaño (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors({ ...errors, image: 'La imagen es demasiado grande. Máximo 5MB.' });
        return;
      }
      
      setImageFile(file);
      setErrors({ ...errors, image: null });
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      
      // Si estamos creando y hay una imagen, usar FormData
      if (!artwork && imageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', imageFile);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('artist', formData.artist);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('year', formData.year);
        formDataToSend.append('technique', formData.technique);
        formDataToSend.append('dimensions', `${formData.height} x ${formData.width} ${formData.unit}`);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('pricing[basePrice]', formData.price);
        formDataToSend.append('pricing[currency]', formData.currency || 'ARS');
        formDataToSend.append('pricing[discount]', formData.discountPercentage || 0);
        formDataToSend.append('status[isAvailable]', !formData.sold);
        formDataToSend.append('status[isSold]', formData.sold);
        formDataToSend.append('featured', formData.featured);
        
        // Tags
        if (formData.tags) {
          const tagsArray = typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()) : formData.tags;
          tagsArray.forEach((tag, index) => {
            formDataToSend.append(`tags[${index}]`, tag);
          });
        }
        
        // Debug: Log FormData content
        console.log('📋 FormData contenido:');
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`  ${key}:`, value);
        }
        
        response = await createArtwork(formDataToSend, true); // true indica que es FormData
      } else {
        // Usar JSON para actualización o creación sin imagen
        const dataToSubmit = {
          title: formData.title,
          description: formData.description,
          artist: formData.artist,
          category: formData.category,
          technique: formData.technique,
          dimensions: `${formData.height} x ${formData.width} ${formData.unit}`,
          year: parseInt(formData.year),
          pricing: {
            basePrice: parseFloat(formData.price),
            finalPrice: parseFloat(formData.price),
            discount: parseFloat(formData.discountPercentage) || 0,
            currency: formData.currency || 'ARS'
          },
          status: {
            isAvailable: !formData.sold,
            isSold: formData.sold
          },
          featured: formData.featured,
          tags: formData.tags ? (typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()) : formData.tags) : [],
          images: {
            main: {
              url: formData.imageUrl
            },
            thumbnail: {
              url: generateThumbnailUrl(formData.imageUrl)
            }
          }
        };
        
        if (artwork) {
          response = await updateArtwork(artwork.id, dataToSubmit);
        } else {
          response = await createArtwork(dataToSubmit);
        }
      }
      
      if (response.success) {
        onSuccess(artwork ? 'Obra actualizada exitosamente' : 'Obra creada exitosamente');
        onClose();
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al guardar la obra';
      if (onError) {
        onError(errorMessage);
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const generateThumbnailUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    // If it's a Cloudinary URL, add transformation
    if (imageUrl.includes('cloudinary.com')) {
      const parts = imageUrl.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/c_thumb,w_300/${parts[1]}`;
      }
    }
    
    return imageUrl;
  };

  const handleImageUrlChange = (e) => {
    const imageUrl = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl,
      thumbnailUrl: generateThumbnailUrl(imageUrl)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gallery-200">
          <h2 className="text-xl font-serif font-bold text-gallery-900">
            {artwork ? 'Editar Obra' : 'Nueva Obra'}
          </h2>
          <button
            onClick={onClose}
            className="btn-icon text-gallery-600 hover:text-gallery-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gallery-300'
                }`}
                placeholder="Ej: Composición Abstracta"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.description ? 'border-red-500' : 'border-gallery-300'
                }`}
                placeholder="Describe la obra..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              >
                {categoryOptions.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Precio *
              </label>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full sm:col-span-1 px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`col-span-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                    errors.price ? 'border-red-500' : 'border-gallery-300'
                  }`}
                  placeholder="1000"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Dimensions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Dimensiones *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                      errors.height ? 'border-red-500' : 'border-gallery-300'
                    }`}
                    placeholder="Alto"
                  />
                  {errors.height && (
                    <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                      errors.width ? 'border-red-500' : 'border-gallery-300'
                    }`}
                    placeholder="Ancho"
                  />
                  {errors.width && (
                    <p className="text-red-500 text-xs mt-1">{errors.width}</p>
                  )}
                </div>
                <div>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gallery-500 mt-1">
                Formato: Alto x Ancho {formData.unit}
              </p>
            </div>

            {/* Technique */}
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Técnica *
              </label>
              <input
                type="text"
                name="technique"
                value={formData.technique}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.technique ? 'border-red-500' : 'border-gallery-300'
                }`}
                placeholder="Ej: Óleo sobre lienzo"
              />
              {errors.technique && (
                <p className="text-red-500 text-sm mt-1">{errors.technique}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Año *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.year ? 'border-red-500' : 'border-gallery-300'
                }`}
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year}</p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.discountPercentage ? 'border-red-500' : 'border-gallery-300'
                }`}
              />
              {errors.discountPercentage && (
                <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>
              )}
            </div>

            {/* Image Upload/URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                {artwork ? 'Imagen' : 'Imagen *'}
              </label>
              
              {/* Solo mostrar upload para creación */}
              {!artwork && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      errors.image ? 'border-red-500' : 'border-gallery-300 hover:border-gallery-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={imagePreview}
                          alt="Vista previa"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gallery-600">Click para cambiar imagen</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gallery-400" />
                        <p className="text-sm text-gallery-600">
                          Click para subir imagen
                        </p>
                        <p className="text-xs text-gallery-500">
                          JPG, PNG, WebP. Máximo 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image}</p>
                  )}
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gallery-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gallery-500">O proporcione una URL</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Campo URL para edición o alternativa */}
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.imageUrl ? 'border-red-500' : 'border-gallery-300'
                } ${!artwork ? 'mt-3' : ''}`}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              
              {errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
              )}
              
              {/* Image preview para URL */}
              {formData.imageUrl && !imagePreview && (
                <div className="mt-3 flex items-center space-x-4">
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa"
                    className="h-20 w-20 object-cover rounded-lg border border-gallery-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="text-sm text-gallery-600">Vista previa de la imagen</p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="sold"
                  checked={formData.sold}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent rounded focus:ring-accent focus:ring-2"
                />
                <span className="text-sm font-medium text-gallery-700">
                  Marcar como vendida
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent rounded focus:ring-accent focus:ring-2"
                />
                <span className="text-sm font-medium text-gallery-700">
                  ⭐ Obra destacada
                </span>
                <span className="text-xs text-gallery-500">(aparece en el carrusel principal)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gallery-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary btn-sm"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                artwork ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ArtworkForm;