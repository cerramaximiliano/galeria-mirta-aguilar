import { useState, useEffect } from 'react';
import { Plus, Palette, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import AdminDigitalArtModal from './AdminDigitalArtModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import useToast from '../../hooks/useToast';
import { formatPrice } from '../../utils/formatters';

const AdminDigitalArt = () => {
  const [digitalArtworks, setDigitalArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingArtwork, setDeletingArtwork] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const toast = useToast();

  useEffect(() => {
    fetchDigitalArtworks();
  }, [currentPage]);

  const fetchDigitalArtworks = async () => {
    try {
      setLoading(true);
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const token = adminUser.token;
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';
      
      const response = await fetch(
        `${apiUrl}/digital-art?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar las obras digitales');
      }

      const data = await response.json();
      
      if (data.success) {
        setDigitalArtworks(data.data || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las obras digitales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArtwork(null);
    setIsModalOpen(true);
  };

  const handleEdit = (artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleDelete = (artwork) => {
    setDeletingArtwork(artwork);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingArtwork) return;
    
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const token = adminUser.token;
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';
      
      const response = await fetch(`${apiUrl}/digital-art/${deletingArtwork._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la obra digital');
      }

      toast.success('Obra digital eliminada correctamente');
      fetchDigitalArtworks();
      setShowDeleteDialog(false);
      setDeletingArtwork(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la obra digital');
    }
  };

  const toggleAvailability = async (artwork) => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const token = adminUser.token;
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';
      
      const response = await fetch(`${apiUrl}/digital-art/${artwork._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ available: !artwork.available })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la disponibilidad');
      }

      toast.success('Disponibilidad actualizada');
      fetchDigitalArtworks();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la disponibilidad');
    }
  };

  const toggleFeatured = async (artwork) => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const token = adminUser.token;
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';
      
      const response = await fetch(`${apiUrl}/digital-art/${artwork._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !artwork.featured })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado destacado');
      }

      toast.success('Estado destacado actualizado');
      fetchDigitalArtworks();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el estado destacado');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif font-bold text-gallery-900">
          Arte Digital
        </h2>
        <button
          onClick={handleCreate}
          className="btn-primary"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva Obra Digital</span>
        </button>
      </div>

      {/* Tabla de obras digitales */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obra Original
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaños / Precios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {digitalArtworks.map((artwork) => (
                <tr key={artwork._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gallery-100">
                      <img
                        src={artwork.thumbnailUrl || artwork.imageUrl}
                        alt={artwork.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {artwork.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        Versión: {artwork.version}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {artwork.originalTitle}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      {artwork.sizes.map((size, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="font-medium">{size.size}:</span>
                          <span className={size.available ? 'text-green-600' : 'text-gray-400 line-through'}>
                            {formatPrice(size.price, size.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleAvailability(artwork)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                          artwork.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {artwork.available ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Disponible
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            No disponible
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => toggleFeatured(artwork)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                          artwork.featured
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Star className={`h-3 w-3 mr-1 ${artwork.featured ? 'fill-current' : ''}`} />
                        {artwork.featured ? 'Destacada' : 'Normal'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`/arte-digital/${artwork._id || artwork.id}`, '_blank')}
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

        {digitalArtworks.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay obras digitales registradas</p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de creación/edición */}
      {isModalOpen && (
        <AdminDigitalArtModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedArtwork(null);
          }}
          artwork={selectedArtwork}
          onSuccess={() => {
            fetchDigitalArtworks();
            setIsModalOpen(false);
            setSelectedArtwork(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          title="Eliminar Obra Digital"
          message={`¿Estás seguro de que deseas eliminar "${deletingArtwork?.title}"? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteDialog(false);
            setDeletingArtwork(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDigitalArt;