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
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useArtworksStore from '../../store/artworksStore';
import AdminArtworks from '../../components/admin/AdminArtworks';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gallery-900">
                Panel de Administración
              </h1>
              <p className="text-gallery-600">Bienvenido, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
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
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-soft mb-6">
          <div className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <Image className="h-4 w-4 inline-block mr-2" />
              Vista General
            </button>
            <button
              onClick={() => setActiveTab('artworks')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'artworks'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <Palette className="h-4 w-4 inline-block mr-2" />
              Gestión de Obras
            </button>
            <button
              onClick={() => setActiveTab('biography')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'biography'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <User className="h-4 w-4 inline-block mr-2" />
              Biografía
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <Phone className="h-4 w-4 inline-block mr-2" />
              Contacto
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-gallery-900 text-white'
                  : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
              }`}
            >
              <MessageCircle className="h-4 w-4 inline-block mr-2" />
              Mensajes
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        
        {activeTab === 'biography' && <BiographyEditor />}
        
        {activeTab === 'contact' && <ContactInfoEditor />}
        
        {activeTab === 'messages' && <Messages />}
      </div>
    </div>
  );
};

export default Dashboard;