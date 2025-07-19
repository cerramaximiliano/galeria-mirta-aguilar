import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import newsletterService from '../../services/newsletter.service';
import siteInfoService from '../../services/siteInfo.service';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [contactInfo, setContactInfo] = useState(null);

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
      console.error('Error loading contact info:', err);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor ingresa tu email' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await newsletterService.subscribe({ email });
      
      // Verificar la respuesta del servidor
      // El servidor puede devolver dos formatos:
      // 1. {success: true, data: {email, status}, message}
      // 2. {email, status} directamente
      
      const isSuccessFormat = response && response.success;
      const isDirectFormat = response && response.status && (response.status === 'subscribed' || response.status === 'already_subscribed' || response.status === 'reactivated');
      
      if (isSuccessFormat || isDirectFormat) {
        // Determinar el mensaje según el formato
        let successMessage = '¡Te has suscrito exitosamente!';
        
        if (isSuccessFormat) {
          successMessage = response.message;
        } else if (response.status === 'already_subscribed') {
          successMessage = 'Ya estás suscrito a nuestro newsletter';
        } else if (response.status === 'reactivated') {
          successMessage = 'Tu suscripción ha sido reactivada exitosamente';
        }
        
        setMessage({ type: 'success', text: successMessage });
        
        // Limpiar el email solo si es una nueva suscripción o reactivación
        const status = isSuccessFormat ? response.data?.status : response.status;
        if (status === 'subscribed' || status === 'reactivated') {
          setEmail('');
        }
      } else {
        setMessage({ type: 'error', text: response?.message || 'No pudimos procesar tu suscripción. Por favor intenta más tarde.' });
      }
    } catch (error) {
      
      // Mensajes de error amigables para el usuario
      let errorMessage = 'No pudimos procesar tu suscripción. Por favor intenta más tarde.';
      
      if (error.response?.status === 409) {
        errorMessage = 'Este email ya está suscrito a nuestro newsletter.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Por favor verifica que el email sea válido.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Estamos experimentando problemas técnicos. Por favor intenta más tarde.';
      } else if (!navigator.onLine) {
        errorMessage = 'No hay conexión a internet. Por favor verifica tu conexión.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gallery-900 text-white">
      <div className="border-t border-gallery-800">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-serif text-2xl font-bold mb-4 text-white">
                Mirta <span className="text-accent">Susana</span> Aguilar
              </h3>
              <p className="text-gallery-300 mb-6">
                Artista plástica argentina con más de 30 años de trayectoria, 
                creando obras que conectan emociones y espacios.
              </p>
              <div className="flex space-x-4">
                {contactInfo?.socialMedia?.instagram && (
                  <a
                    href={contactInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon bg-gallery-800 hover:bg-gallery-700 text-white"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {contactInfo?.socialMedia?.facebook && (
                  <a
                    href={contactInfo.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon bg-gallery-800 hover:bg-gallery-700 text-white"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-serif text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gallery-300 hover:text-accent transition-colors">
                    Galería
                  </Link>
                </li>
                <li>
                  <Link to="/biografia" className="text-gallery-300 hover:text-accent transition-colors">
                    Biografía
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="text-gallery-300 hover:text-accent transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link to="/carrito" className="text-gallery-300 hover:text-accent transition-colors">
                    Mi Carrito
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-serif text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-3">
                {contactInfo?.phone && (
                  <li className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-accent mt-0.5" />
                    <span className="text-gallery-300">{contactInfo.phone}</span>
                  </li>
                )}
                {contactInfo?.email && (
                  <li className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-accent mt-0.5" />
                    <span className="text-gallery-300">{contactInfo.email}</span>
                  </li>
                )}
                {contactInfo?.address && (
                  <li className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5" />
                    <span className="text-gallery-300">
                      {contactInfo.address.city}, {contactInfo.address.province}
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-serif text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gallery-300 mb-4">
                Recibe novedades sobre nuevas obras y exposiciones
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-gallery-800 border border-gallery-700 rounded-lg 
                           text-white placeholder-gallery-400 
                           focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                           transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-accent py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Suscribiendo...' : 'Suscribirse'}
                </button>
                {message.text && (
                  <p className={`text-sm ${
                    message.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {message.text}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="border-t border-gallery-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gallery-400">
            <p>© {currentYear} Mirta Susana Aguilar. Todos los derechos reservados.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacidad" className="hover:text-accent transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terminos" className="hover:text-accent transition-colors">
                Términos y Condiciones
              </Link>
              {!isAuthenticated ? (
                <Link 
                  to="/login" 
                  className="inline-flex items-center space-x-1 hover:text-accent transition-colors"
                  title="Administración"
                >
                  <Lock className="h-3 w-3" />
                  <span>Admin</span>
                </Link>
              ) : isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="inline-flex items-center space-x-1 hover:text-accent transition-colors"
                  title="Panel de Administración"
                >
                  <Lock className="h-3 w-3" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;