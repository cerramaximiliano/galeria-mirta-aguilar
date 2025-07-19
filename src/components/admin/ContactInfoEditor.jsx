import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
import siteInfoService from '../../services/siteInfo.service';
import Snackbar from '../common/Snackbar';

const ContactInfoEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contact, setContact] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: {
      street: '',
      city: '',
      province: '',
      country: '',
      postalCode: ''
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    businessHours: {
      monday: { open: '', close: '', isClosed: false },
      tuesday: { open: '', close: '', isClosed: false },
      wednesday: { open: '', close: '', isClosed: false },
      thursday: { open: '', close: '', isClosed: false },
      friday: { open: '', close: '', isClosed: false },
      saturday: { open: '', close: '', isClosed: false },
      sunday: { open: '', close: '', isClosed: true }
    },
    mapLocation: {
      lat: -34.5895,
      lng: -58.3974
    }
  });
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  useEffect(() => {
    fetchContactInfo();
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

  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      const response = await siteInfoService.getContactInfo();
      if (response.success) {
        setContact(response.data);
      }
    } catch (error) {
      showSnackbar('Error al cargar la información de contacto', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setContact(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSocialChange = (platform, value) => {
    setContact(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setContact(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleLocationChange = (field, value) => {
    setContact(prev => ({
      ...prev,
      mapLocation: {
        ...prev.mapLocation,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await siteInfoService.updateContactInfo(contact);
      if (response.success) {
        showSnackbar('Información de contacto actualizada exitosamente', 'success');
      }
    } catch (error) {
      showSnackbar('Error al guardar la información', 'error');
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
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-serif font-bold text-gallery-900 mb-6">
          Información de Contacto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gallery-800 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Información de Contacto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={contact.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gallery-800 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Dirección
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Calle y Número
                </label>
                <input
                  type="text"
                  value={contact.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={contact.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  value={contact.address.province}
                  onChange={(e) => handleAddressChange('province', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  value={contact.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={contact.address.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            {/* Coordenadas del mapa */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Latitud
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={contact.mapLocation.lat}
                  onChange={(e) => handleLocationChange('lat', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Longitud
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={contact.mapLocation.lng}
                  onChange={(e) => handleLocationChange('lng', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gallery-800 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Redes Sociales
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="https://instagram.com/usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="https://facebook.com/usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="https://twitter.com/usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="https://linkedin.com/in/usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gallery-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  value={contact.socialMedia.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="https://youtube.com/@usuario"
                />
              </div>
            </div>
          </div>

          {/* Horarios de atención */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gallery-800 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Horarios de Atención
            </h3>
            
            <div className="space-y-2">
              {days.map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2 p-2 bg-gallery-50 rounded-lg">
                  <span className="w-24 text-sm font-medium text-gallery-700">{label}</span>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={contact.businessHours[key].isClosed}
                      onChange={(e) => handleHoursChange(key, 'isClosed', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gallery-600">Cerrado</span>
                  </label>
                  
                  {!contact.businessHours[key].isClosed && (
                    <>
                      <input
                        type="time"
                        value={contact.businessHours[key].open}
                        onChange={(e) => handleHoursChange(key, 'open', e.target.value)}
                        className="px-2 py-1 border border-gallery-300 rounded"
                      />
                      <span className="text-gallery-600">a</span>
                      <input
                        type="time"
                        value={contact.businessHours[key].close}
                        onChange={(e) => handleHoursChange(key, 'close', e.target.value)}
                        className="px-2 py-1 border border-gallery-300 rounded"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
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

export default ContactInfoEditor;