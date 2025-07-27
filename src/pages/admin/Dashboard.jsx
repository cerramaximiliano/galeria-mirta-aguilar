import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Image, 
  DollarSign,
  Package,
  Palette,
  User,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useArtworksStore from '../../store/artworksStore';
import AdminArtworks from '../../components/admin/AdminArtworks';
import AdminDigitalArt from '../../components/admin/AdminDigitalArt';
import BiographyEditor from '../../components/admin/BiographyEditor';
import ContactInfoEditor from '../../components/admin/ContactInfoEditor';
import Messages from '../admin/Messages';
import { formatPrice } from '../../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { artworks } = useArtworksStore();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = {
    total: artworks.length,
    available: artworks.filter(a => a.available).length,
    sold: artworks.filter(a => !a.available).length,
    totalValue: artworks.reduce((sum, a) => sum + a.price, 0),
    currency: artworks.length > 0 ? artworks[0].currency || 'ARS' : 'ARS'
  };

  return (
    <div className="min-h-screen bg-gallery-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-gallery-900">
                Panel de Administración
              </h1>
              <p className="text-sm sm:text-base text-gallery-600">Bienvenido, {user?.name}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/" className="btn-secondary btn-sm">
                Ver Sitio
              </Link>
              <button onClick={handleLogout} className="btn-icon text-gallery-600 hover:text-gallery-900">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Tab Navigation - Responsive with scroll on mobile */}
        <div className="bg-white rounded-lg shadow-soft mb-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1 p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center justify-center min-w-fit px-3 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <Image className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Vista General</span>
            </button>
            <button
              onClick={() => setActiveTab('artworks')}
              className={`flex items-center justify-center min-w-fit px-3 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'artworks'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <Palette className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Gestión de Obras</span>
            </button>
            <button
              onClick={() => setActiveTab('digitalart')}
              className={`flex items-center justify-center min-w-fit px-3 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'digitalart'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <Sparkles className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Arte Digital</span>
            </button>
            <button
              onClick={() => setActiveTab('biography')}
              className={`flex items-center justify-center min-w-fit px-3 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'biography'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <User className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Biografía</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center justify-center min-w-fit px-3 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'contact'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <Phone className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Contacto</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center justify-center min-w-fit px-3 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'messages'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Mensajes</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gallery-600">Total Obras</h3>
              <Image className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-gallery-900">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gallery-600">Disponibles</h3>
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gallery-900">{stats.available}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gallery-600">Vendidas</h3>
              <DollarSign className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gallery-900">{stats.sold}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gallery-600">Valor Total</h3>
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-gallery-900">
              {formatPrice(stats.totalValue, stats.currency)}
            </p>
          </motion.div>
        </div>

          </>
        )}

        {activeTab === 'artworks' && <AdminArtworks />}
        
        {activeTab === 'digitalart' && <AdminDigitalArt />}
        
        {activeTab === 'biography' && <BiographyEditor />}
        
        {activeTab === 'contact' && <ContactInfoEditor />}
        
        {activeTab === 'messages' && <Messages />}
      </div>
    </div>
  );
};

export default Dashboard;