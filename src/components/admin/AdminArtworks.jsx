import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Info
} from 'lucide-react';
import useArtworksStore from '../../store/artworksStore';
import ArtworkForm from './ArtworkForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { formatPrice } from '../../utils/formatters';

const AdminArtworks = () => {
  const { 
    artworks, 
    filteredArtworks,
    loading,
    fetchArtworks,
    setSearchTerm,
    setSelectedCategory,
    selectedCategory,
    deleteArtwork,
    getCategories
  } = useArtworksStore();
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArtworks = filteredArtworks.slice(startIndex, endIndex);

  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingArtwork, setDeletingArtwork] = useState(null);
  const [notification, setNotification] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  useEffect(() => {
    fetchArtworks({ limit: 100 }); // Obtener hasta 100 obras
  }, [fetchArtworks]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, filteredArtworks.length]);

  // Obtener categorías dinámicas del store
  const categories = getCategories();

  const handleCreate = () => {
    setEditingArtwork(null);
    setShowForm(true);
  };

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork);
    setShowForm(true);
  };

  const handleDelete = (artwork) => {
    setDeletingArtwork(artwork);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingArtwork) return;

    try {
      const response = await deleteArtwork(deletingArtwork.id);
      if (response.success) {
        showNotification('success', 'Obra eliminada exitosamente');
      }
    } catch (error) {
      showNotification('error', error.message || 'Error al eliminar la obra');
    } finally {
      setShowDeleteDialog(false);
      setDeletingArtwork(null);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFormSuccess = (message) => {
    showNotification('success', message);
  };

  const handleFormError = (message) => {
    showNotification('error', message);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // Debounce the search
    const timeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const stats = {
    total: artworks.length,
    available: artworks.filter(a => a.available).length,
    sold: artworks.filter(a => !a.available).length,
    totalValue: artworks.reduce((sum, a) => sum + a.price, 0),
    currency: artworks.length > 0 ? artworks[0].currency || 'ARS' : 'ARS'
  };

  return (
    <div className="min-h-screen bg-gallery-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gallery-900 mb-2">
            Gestión de Obras
          </h1>
          <p className="text-gallery-600">
            Administra el catálogo completo de obras de arte
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Total Obras</h3>
            <p className="text-xl sm:text-2xl font-bold text-gallery-900">{stats.total}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Disponibles</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.available}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Vendidas</h3>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.sold}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Valor Total</h3>
            <p className="text-lg sm:text-2xl font-bold text-gallery-900">
              {formatPrice(stats.totalValue, stats.currency)}
            </p>
          </motion.div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gallery-400" />
              <input
                type="text"
                value={localSearchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por título o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Category Filter and Create Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-gallery-600 hidden sm:block" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-sm sm:text-base"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                className="btn-primary btn-sm w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Obra
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Table/Cards */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="mt-4 text-gallery-600">Cargando obras...</p>
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gallery-600">No se encontraron obras</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="md:hidden">
                <div className="divide-y divide-gallery-200">
                  {paginatedArtworks.map((artwork) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4"
                    >
                      <div className="flex space-x-4">
                        {/* Image */}
                        <img
                          src={artwork.thumbnailUrl || artwork.imageUrl}
                          alt={artwork.title}
                          className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                        />
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 mr-2">
                              <h3 className="text-sm font-medium text-gallery-900 truncate">
                                {artwork.title}
                              </h3>
                              <p className="text-xs text-gallery-500 mt-1">
                                {artwork.technique} • {artwork.dimensions}
                              </p>
                              <p className="text-xs text-gallery-400">
                                Año: {artwork.year}
                              </p>
                            </div>
                            {artwork.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {/* Tags */}
                          <div className="mt-2 flex items-center flex-wrap gap-2">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gallery-100 text-gallery-800">
                              {categories.find(c => c.value === artwork.category)?.label || artwork.category}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              artwork.available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {artwork.available ? 'Disponible' : 'Vendida'}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-sm font-medium text-gallery-900">
                              {formatPrice(artwork.price, artwork.currency)}
                            </div>
                            {artwork.discountPercentage > 0 && (
                              <div className="text-xs text-green-600">
                                {artwork.discountPercentage}% descuento
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="mt-3 flex items-center space-x-3">
                            <button
                              onClick={() => window.open(`/obra/${artwork.id}`, '_blank')}
                              className="text-xs text-gallery-600 hover:text-gallery-900 font-medium"
                            >
                              Ver obra
                            </button>
                            <button
                              onClick={() => handleEdit(artwork)}
                              className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(artwork)}
                              className="text-xs text-red-600 hover:text-red-900 font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gallery-50 border-b border-gallery-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Imagen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Información
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <span>Destacada</span>
                          <div className="group relative">
                            <Info className="h-4 w-4 text-gallery-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gallery-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Las obras destacadas aparecen en el carrusel principal de la página de inicio
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                <div className="border-4 border-transparent border-t-gallery-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gallery-200">
                    {paginatedArtworks.map((artwork) => (
                      <tr key={artwork.id} className="hover:bg-gallery-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={artwork.thumbnailUrl || artwork.imageUrl}
                            alt={artwork.title}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gallery-900">
                              {artwork.title}
                            </div>
                            <div className="text-sm text-gallery-500">
                              {artwork.technique} - {artwork.dimensions}
                            </div>
                            <div className="text-xs text-gallery-400">
                              Año: {artwork.year}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gallery-100 text-gallery-800">
                            {categories.find(c => c.value === artwork.category)?.label || artwork.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {artwork.featured ? (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mx-auto" />
                          ) : (
                            <span className="text-gallery-300">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gallery-900">
                              {formatPrice(artwork.price, artwork.currency)}
                            </div>
                            {artwork.discountPercentage > 0 && (
                              <div className="text-xs text-green-600">
                                {artwork.discountPercentage}% descuento
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            artwork.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {artwork.available ? 'Disponible' : 'Vendida'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => window.open(`/obra/${artwork.id}`, '_blank')}
                              className="btn-icon text-gallery-600 hover:text-gallery-900"
                              title="Ver"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(artwork)}
                              className="btn-icon text-blue-600 hover:text-blue-900"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(artwork)}
                              className="btn-icon text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gallery-200 gap-4">
                  <div className="text-xs sm:text-sm text-gallery-600 text-center sm:text-left">
                    Mostrando {startIndex + 1} - {Math.min(endIndex, filteredArtworks.length)} de {filteredArtworks.length} obras
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        currentPage === 1 
                          ? 'text-gallery-300 cursor-not-allowed' 
                          : 'text-gallery-600 hover:bg-gallery-100'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    
                    {/* Mobile: Show only current page */}
                    <div className="flex items-center space-x-1 sm:hidden">
                      <span className="px-3 py-1 text-sm">
                        {currentPage} / {totalPages}
                      </span>
                    </div>
                    
                    {/* Desktop: Show page numbers */}
                    <div className="hidden sm:flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-accent text-white'
                                  : 'text-gallery-600 hover:bg-gallery-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="text-gallery-400">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        currentPage === totalPages 
                          ? 'text-gallery-300 cursor-not-allowed' 
                          : 'text-gallery-600 hover:bg-gallery-100'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ArtworkForm
            artwork={editingArtwork}
            onClose={() => {
              setShowForm(false);
              setEditingArtwork(null);
            }}
            onSuccess={handleFormSuccess}
            onError={handleFormError}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <DeleteConfirmDialog
            title="Eliminar Obra"
            message={`¿Estás seguro de que deseas eliminar "${deletingArtwork?.title}"? Esta acción no se puede deshacer.`}
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteDialog(false);
              setDeletingArtwork(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminArtworks;