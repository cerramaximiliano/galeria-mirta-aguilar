import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Clock, Twitter, Linkedin, Youtube, Loader2 } from 'lucide-react';
import siteInfoService from '../services/siteInfo.service';
import contactService from '../services/contact.service';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await siteInfoService.getContactInfo();
      if (response.success) {
        setContactInfo(response.data);
      }
    } catch (err) {
      setError('Error al cargar la información de contacto');
      console.error('Error loading contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
      errors.name = 'El nombre solo puede contener letras y espacios';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }
    
    // Validate phone (optional but if provided, must be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'El teléfono solo puede contener números y caracteres válidos';
      } else if (formData.phone.replace(/\D/g, '').length < 8) {
        errors.phone = 'El teléfono debe tener al menos 8 dígitos';
      }
    }
    
    // Validate subject
    if (!formData.subject) {
      errors.subject = 'Por favor selecciona un asunto';
    }
    
    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    } else if (formData.message.trim().length > 1000) {
      errors.message = 'El mensaje no puede exceder los 1000 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors({});
    setSubmitStatus(null);
    
    try {
      const response = await contactService.sendMessage(formData);
      
      // Si la respuesta es null o undefined pero no hubo error, considerarlo como éxito
      // ya que el servidor devolvió 200
      if (response === null || response === undefined || response.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
        setFormErrors({ submit: response?.message || 'No pudimos enviar tu mensaje. Por favor intenta más tarde.' });
      }
    } catch (error) {
      console.error('❌ Contact Component: Error al enviar mensaje:', error);
      setSubmitStatus('error');
      
      // Mensajes de error amigables
      let errorMessage = 'No pudimos enviar tu mensaje. Por favor intenta más tarde.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Por favor verifica que todos los campos estén correctos.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Estamos experimentando problemas técnicos. Por favor intenta más tarde.';
      } else if (!navigator.onLine) {
        errorMessage = 'No hay conexión a internet. Por favor verifica tu conexión.';
      }
      
      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBusinessHours = (hours) => {
    if (!hours) return [];
    
    const daysOfWeek = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };

    const groupedHours = [];
    let currentGroup = null;

    Object.entries(daysOfWeek).forEach(([key, label]) => {
      const dayHours = hours[key];
      if (!dayHours) return;

      const hourString = dayHours.isClosed ? 'Cerrado' : `${dayHours.open} - ${dayHours.close}`;

      if (!currentGroup || currentGroup.hours !== hourString) {
        currentGroup = { days: [label], hours: hourString };
        groupedHours.push(currentGroup);
      } else {
        currentGroup.days.push(label);
      }
    });

    return groupedHours.map(group => ({
      days: group.days.length === 1 ? group.days[0] : `${group.days[0]} a ${group.days[group.days.length - 1]}`,
      hours: group.hours
    }));
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'linkedin': return Linkedin;
      case 'youtube': return Youtube;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const businessHours = formatBusinessHours(contactInfo?.businessHours);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gallery-50">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-gallery-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
        </div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
              Conectemos a través del Arte
            </h1>
            <p className="text-lg text-white/80">
              ¿Tienes alguna pregunta sobre mis obras? ¿Te gustaría adquirir una pieza? 
              Estoy aquí para ayudarte a encontrar el arte perfecto para tu espacio.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                {contactInfo?.phone && (
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gallery-900">Teléfono</h3>
                      <p className="text-gallery-600">{contactInfo.phone}</p>
                      {contactInfo.whatsapp && (
                        <p className="text-sm text-gallery-500">WhatsApp: {contactInfo.whatsapp}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {contactInfo?.email && (
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gallery-900">Email</h3>
                      <p className="text-gallery-600">{contactInfo.email}</p>
                      <p className="text-sm text-gallery-500">Respuesta en 24-48hs</p>
                    </div>
                  </motion.div>
                )}

                {contactInfo?.address && (
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gallery-900">Ubicación</h3>
                      <p className="text-gallery-600">{contactInfo.address.street}</p>
                      <p className="text-gallery-600">
                        {contactInfo.address.city}, {contactInfo.address.province}
                      </p>
                      <p className="text-sm text-gallery-500">Visitas con cita previa</p>
                    </div>
                  </motion.div>
                )}

                {businessHours.length > 0 && (
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gallery-900">Horario de Atención</h3>
                      {businessHours.map((schedule, index) => (
                        <div key={index}>
                          <p className="text-gallery-600">{schedule.days}</p>
                          <p className="text-sm text-gallery-500">{schedule.hours}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {contactInfo?.socialMedia && Object.entries(contactInfo.socialMedia).some(([_, url]) => url && url.trim()) && (
                <div className="mt-8 pt-8 border-t border-gallery-200">
                  <h3 className="font-semibold text-gallery-900 mb-4">Sígueme en Redes</h3>
                  <div className="flex space-x-3">
                    {Object.entries(contactInfo.socialMedia)
                      .filter(([platform, url]) => url && url.trim() && getSocialIcon(platform))
                      .map(([platform, url]) => {
                        const Icon = getSocialIcon(platform);
                        
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-icon bg-gallery-100 hover:bg-accent hover:text-white text-gallery-700"
                            aria-label={platform}
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Formulario de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Envíame un Mensaje</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gallery-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gallery-50 border rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                               transition-all duration-300 ${
                                 formErrors.name ? 'border-red-500' : 'border-gallery-200'
                               }`}
                      placeholder="Tu nombre"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gallery-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gallery-50 border rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                               transition-all duration-300 ${
                                 formErrors.email ? 'border-red-500' : 'border-gallery-200'
                               }`}
                      placeholder="tu@email.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gallery-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gallery-50 border rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                               transition-all duration-300 ${
                                 formErrors.phone ? 'border-red-500' : 'border-gallery-200'
                               }`}
                      placeholder="+54 11 1234-5678"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gallery-700 mb-2">
                      Asunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gallery-50 border rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                               transition-all duration-300 ${
                                 formErrors.subject ? 'border-red-500' : 'border-gallery-200'
                               }`}
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="compra">Comprar una obra</option>
                      <option value="info">Información sobre una obra</option>
                      <option value="exposicion">Exposiciones</option>
                      <option value="encargo">Encargo personalizado</option>
                      <option value="otro">Otro</option>
                    </select>
                    {formErrors.subject && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gallery-700 mb-2">
                    Mensaje * {formData.message && (
                      <span className="text-sm font-normal text-gallery-500">
                        ({formData.message.length}/1000)
                      </span>
                    )}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-gallery-50 border rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                             transition-all duration-300 resize-none ${
                               formErrors.message ? 'border-red-500' : 'border-gallery-200'
                             }`}
                    placeholder="Cuéntame más sobre tu interés en mi trabajo..."
                    maxLength={1000}
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gallery-500">
                    * Campos obligatorios
                  </p>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Enviar Mensaje</span>
                      </>
                    )}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <p className="text-green-700 font-medium">
                      ¡Mensaje enviado con éxito! Te responderé pronto.
                    </p>
                  </motion.div>
                )}
                
                {submitStatus === 'error' && formErrors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-700 font-medium">
                      {formErrors.submit}
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;