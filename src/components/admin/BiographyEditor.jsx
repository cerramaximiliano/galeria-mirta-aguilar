import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Upload, X, Plus, Trash2, Link } from 'lucide-react';
import siteInfoService from '../../services/siteInfo.service';
import Snackbar from '../common/Snackbar';

const BiographyEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [biography, setBiography] = useState({
    title: '',
    subtitle: '',
    content: '',
    profileImage: { url: '', alt: '' },
    highlights: [],
    exhibitions: [],
    awards: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchBiography();
  }, []);

  const showSnackbar = (message, type = 'success') => {
    setSnackbar({
      isOpen: true,
      message,
      type
    });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  };

  const fetchBiography = async () => {
    setLoading(true);
    try {
      const response = await siteInfoService.getBiography();
      if (response.success) {
        setBiography(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar la biografía', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setBiography(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar formato
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showSnackbar('Formato de imagen no válido. Use JPG, PNG o WebP.', 'error');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('La imagen es demasiado grande. Máximo 5MB.', 'error');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    
    try {
      const response = await siteInfoService.uploadProfileImage(imageFile);
      if (response.success) {
        setBiography(prev => ({
          ...prev,
          profileImage: response.data
        }));
        setImageFile(null);
        setImagePreview(null);
        showSnackbar('Imagen actualizada exitosamente', 'success');
      }
    } catch (error) {
      showSnackbar('Error al subir la imagen', 'error');
    }
  };

  // Manejo de highlights
  const addHighlight = () => {
    setBiography(prev => ({
      ...prev,
      highlights: [...prev.highlights, { year: new Date().getFullYear(), achievement: '', externalUrl: '', externalUrlCaption: '' }]
    }));
  };

  const updateHighlight = (index, field, value) => {
    setBiography(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => 
        i === index ? { ...h, [field]: value } : h
      )
    }));
  };

  const removeHighlight = (index) => {
    setBiography(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Manejo de exhibitions
  const addExhibition = () => {
    setBiography(prev => ({
      ...prev,
      exhibitions: [...prev.exhibitions, {
        year: new Date().getFullYear(),
        title: '',
        location: '',
        description: '',
        externalUrl: '',
        externalUrlCaption: '',
        catalogUrl: '',
        catalogUrlCaption: ''
      }]
    }));
  };

  const updateExhibition = (index, field, value) => {
    setBiography(prev => ({
      ...prev,
      exhibitions: prev.exhibitions.map((e, i) => 
        i === index ? { ...e, [field]: value } : e
      )
    }));
  };

  const removeExhibition = (index) => {
    setBiography(prev => ({
      ...prev,
      exhibitions: prev.exhibitions.filter((_, i) => i !== index)
    }));
  };

  // Manejo de awards
  const addAward = () => {
    setBiography(prev => ({
      ...prev,
      awards: [...prev.awards, {
        year: new Date().getFullYear(),
        title: '',
        organization: '',
        externalUrl: '',
        externalUrlCaption: '',
        certificateUrl: '',
        certificateUrlCaption: ''
      }]
    }));
  };

  const updateAward = (index, field, value) => {
    setBiography(prev => ({
      ...prev,
      awards: prev.awards.map((a, i) => 
        i === index ? { ...a, [field]: value } : a
      )
    }));
  };

  const removeAward = (index) => {
    setBiography(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await siteInfoService.updateBiography(biography);
      if (response.success) {
        showSnackbar('Biografía actualizada exitosamente', 'success');
      }
    } catch (error) {
      showSnackbar('Error al guardar la biografía', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-serif font-bold text-gallery-900 mb-6">
          Editar Biografía
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gallery-800">Información Principal</h3>
            
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={biography.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Subtítulo
              </label>
              <input
                type="text"
                value={biography.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Contenido Principal
              </label>
              <textarea
                value={biography.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                required
              />
            </div>

            {/* Imagen de perfil */}
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Imagen de Perfil
              </label>
              <div className="flex items-start space-x-4">
                {(imagePreview || biography.profileImage?.url) && (
                  <img
                    src={imagePreview || biography.profileImage.url}
                    alt="Perfil"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      console.warn('Error loading profile image:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image"
                  />
                  <label
                    htmlFor="profile-image"
                    className="btn-secondary btn-sm cursor-pointer inline-flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar imagen
                  </label>
                  {imageFile && (
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      className="btn-primary btn-sm ml-2"
                    >
                      Subir imagen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gallery-800">Hitos Destacados</h3>
              <button
                type="button"
                onClick={addHighlight}
                className="btn-secondary btn-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </button>
            </div>
            
            {biography.highlights?.map((highlight, index) => (
              <div key={index} className="p-3 bg-gallery-50 rounded-lg space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <input
                    type="number"
                    value={highlight.year}
                    onChange={(e) => updateHighlight(index, 'year', e.target.value)}
                    className="w-full sm:w-24 px-2 py-1 border border-gallery-300 rounded"
                    placeholder="Año"
                  />
                  <input
                    type="text"
                    value={highlight.achievement}
                    onChange={(e) => updateHighlight(index, 'achievement', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gallery-300 rounded"
                    placeholder="Logro o hito destacado"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-gallery-500 flex-shrink-0" />
                    <input
                      type="url"
                      value={highlight.externalUrl || ''}
                      onChange={(e) => updateHighlight(index, 'externalUrl', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gallery-300 rounded text-sm"
                      placeholder="URL externa (opcional)"
                    />
                  </div>
                  {highlight.externalUrl && (
                    <input
                      type="text"
                      value={highlight.externalUrlCaption || ''}
                      onChange={(e) => updateHighlight(index, 'externalUrlCaption', e.target.value)}
                      className="w-full px-2 py-1 border border-gallery-300 rounded text-sm ml-6"
                      placeholder="Reseña o descripción del enlace (opcional)"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Exhibitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gallery-800">Exposiciones</h3>
              <button
                type="button"
                onClick={addExhibition}
                className="btn-secondary btn-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </button>
            </div>
            
            {biography.exhibitions?.map((exhibition, index) => (
              <div key={index} className="p-4 bg-gallery-50 rounded-lg space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <input
                    type="number"
                    value={exhibition.year}
                    onChange={(e) => updateExhibition(index, 'year', e.target.value)}
                    className="w-full sm:w-24 px-2 py-1 border border-gallery-300 rounded"
                    placeholder="Año"
                  />
                  <input
                    type="text"
                    value={exhibition.title}
                    onChange={(e) => updateExhibition(index, 'title', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gallery-300 rounded"
                    placeholder="Título de la exposición"
                  />
                  <button
                    type="button"
                    onClick={() => removeExhibition(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={exhibition.location}
                  onChange={(e) => updateExhibition(index, 'location', e.target.value)}
                  className="w-full px-2 py-1 border border-gallery-300 rounded"
                  placeholder="Ubicación"
                />
                <input
                  type="text"
                  value={exhibition.description}
                  onChange={(e) => updateExhibition(index, 'description', e.target.value)}
                  className="w-full px-2 py-1 border border-gallery-300 rounded"
                  placeholder="Descripción"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gallery-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-gallery-500 flex-shrink-0" />
                      <input
                        type="url"
                        value={exhibition.externalUrl || ''}
                        onChange={(e) => updateExhibition(index, 'externalUrl', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gallery-300 rounded text-sm"
                        placeholder="URL externa (opcional)"
                      />
                    </div>
                    {exhibition.externalUrl && (
                      <input
                        type="text"
                        value={exhibition.externalUrlCaption || ''}
                        onChange={(e) => updateExhibition(index, 'externalUrlCaption', e.target.value)}
                        className="w-full px-2 py-1 border border-gallery-300 rounded text-sm ml-6"
                        placeholder="Reseña del enlace"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-gallery-500 flex-shrink-0" />
                      <input
                        type="url"
                        value={exhibition.catalogUrl || ''}
                        onChange={(e) => updateExhibition(index, 'catalogUrl', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gallery-300 rounded text-sm"
                        placeholder="URL del catálogo (opcional)"
                      />
                    </div>
                    {exhibition.catalogUrl && (
                      <input
                        type="text"
                        value={exhibition.catalogUrlCaption || ''}
                        onChange={(e) => updateExhibition(index, 'catalogUrlCaption', e.target.value)}
                        className="w-full px-2 py-1 border border-gallery-300 rounded text-sm ml-6"
                        placeholder="Reseña del catálogo"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Awards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gallery-800">Premios y Reconocimientos</h3>
              <button
                type="button"
                onClick={addAward}
                className="btn-secondary btn-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </button>
            </div>
            
            {biography.awards?.map((award, index) => (
              <div key={index} className="p-3 bg-gallery-50 rounded-lg space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <input
                    type="number"
                    value={award.year}
                    onChange={(e) => updateAward(index, 'year', e.target.value)}
                    className="w-full sm:w-24 px-2 py-1 border border-gallery-300 rounded"
                    placeholder="Año"
                  />
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => updateAward(index, 'title', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gallery-300 rounded"
                    placeholder="Título del premio"
                  />
                  <button
                    type="button"
                    onClick={() => removeAward(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={award.organization}
                  onChange={(e) => updateAward(index, 'organization', e.target.value)}
                  className="w-full px-2 py-1 border border-gallery-300 rounded"
                  placeholder="Organización que otorga"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gallery-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-gallery-500 flex-shrink-0" />
                      <input
                        type="url"
                        value={award.externalUrl || ''}
                        onChange={(e) => updateAward(index, 'externalUrl', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gallery-300 rounded text-sm"
                        placeholder="URL externa (opcional)"
                      />
                    </div>
                    {award.externalUrl && (
                      <input
                        type="text"
                        value={award.externalUrlCaption || ''}
                        onChange={(e) => updateAward(index, 'externalUrlCaption', e.target.value)}
                        className="w-full px-2 py-1 border border-gallery-300 rounded text-sm ml-6"
                        placeholder="Reseña del enlace"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-gallery-500 flex-shrink-0" />
                      <input
                        type="url"
                        value={award.certificateUrl || ''}
                        onChange={(e) => updateAward(index, 'certificateUrl', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gallery-300 rounded text-sm"
                        placeholder="URL del certificado (opcional)"
                      />
                    </div>
                    {award.certificateUrl && (
                      <input
                        type="text"
                        value={award.certificateUrlCaption || ''}
                        onChange={(e) => updateAward(index, 'certificateUrlCaption', e.target.value)}
                        className="w-full px-2 py-1 border border-gallery-300 rounded text-sm ml-6"
                        placeholder="Reseña del certificado"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-6 border-t border-gallery-200">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </motion.div>
  );
};

export default BiographyEditor;