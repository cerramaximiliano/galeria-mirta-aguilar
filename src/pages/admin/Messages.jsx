import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2, MessageCircle, User, Tag, Archive, Reply, CheckCircle, AlertTriangle } from 'lucide-react';
import contactService from '../../services/contact.service';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  const itemsPerPage = 10;

  // Función para formatear fechas
  const formatDate = (dateString, includeTime = false) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${date.getMonth() + 1}/${year} ${hours}:${minutes}`;
    }
    
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, filterSubject]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };
      
      if (filterSubject !== 'all') {
        params.subject = filterSubject;
      }
      
      const response = await contactService.getMessages(params);
      
      // Manejar diferentes formatos de respuesta
      if (response) {
        if (response.success && response.data) {
          setMessages(response.data);
          setTotalPages(response.pagination?.pages || 1);
        } else if (Array.isArray(response)) {
          setMessages(response);
          setTotalPages(1);
        } else if (response.data && Array.isArray(response.data)) {
          setMessages(response.data);
          setTotalPages(response.pagination?.pages || 1);
        } else {
          setMessages([]);
        }
      }
    } catch (err) {
      setError('Error al cargar los mensajes');
      console.error('❌ Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      'compra': 'Comprar obra',
      'info': 'Información',
      'exposicion': 'Exposiciones',
      'encargo': 'Encargo personalizado',
      'otro': 'Otro'
    };
    return labels[subject] || subject;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'compra': 'bg-green-100 text-green-800',
      'info': 'bg-blue-100 text-blue-800',
      'exposicion': 'bg-purple-100 text-purple-800',
      'encargo': 'bg-orange-100 text-orange-800',
      'otro': 'bg-gray-100 text-gray-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const getStatusInfo = (status) => {
    const statusInfo = {
      'new': { label: 'Nuevo', color: 'bg-blue-100 text-blue-800', icon: Mail },
      'read': { label: 'Leído', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      'replied': { label: 'Respondido', color: 'bg-green-100 text-green-800', icon: Reply },
      'archived': { label: 'Archivado', color: 'bg-yellow-100 text-yellow-800', icon: Archive }
    };
    return statusInfo[status] || statusInfo['new'];
  };

  const filteredMessages = messages.filter(message => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      message.name.toLowerCase().includes(search) ||
      message.email.toLowerCase().includes(search) ||
      message.message.toLowerCase().includes(search)
    );
  });

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    
    // Marcar como leído si es nuevo
    if (message.status === 'new') {
      try {
        const messageId = message._id || message.id;
        await contactService.updateMessageStatus(messageId, 'read');
        
        // Actualizar localmente
        setMessages(messages.map(m => 
          (m._id === messageId || m.id === messageId) ? { ...m, status: 'read' } : m
        ));
        
        // Actualizar el mensaje seleccionado también
        setSelectedMessage({ ...message, status: 'read' });
      } catch (error) {
        console.error('Error al marcar mensaje como leído:', error);
      }
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    try {
      await contactService.deleteMessage(messageToDelete);
      
      // Remover localmente
      setMessages(messages.filter(m => m._id !== messageToDelete && m.id !== messageToDelete));
      
      // Si el mensaje eliminado estaba seleccionado, cerrar el modal
      if (selectedMessage && (selectedMessage._id === messageToDelete || selectedMessage.id === messageToDelete)) {
        setShowMessageModal(false);
        setSelectedMessage(null);
      }
      
      setShowDeleteModal(false);
      setMessageToDelete(null);
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      alert('Error al eliminar el mensaje. Por favor intenta nuevamente.');
    }
  };

  const handleChangeStatus = async (messageId, newStatus) => {
    try {
      await contactService.updateMessageStatus(messageId, newStatus);
      
      // Actualizar localmente
      setMessages(messages.map(m => 
        (m._id === messageId || m.id === messageId) ? { ...m, status: newStatus } : m
      ));
      
      // Si el mensaje está seleccionado, actualizar también
      if (selectedMessage && (selectedMessage._id === messageId || selectedMessage.id === messageId)) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error('Error al actualizar estado del mensaje:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
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

  return (
    <div className="container-admin py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mensajes de Contacto</h1>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-accent" />
            <span className="text-lg font-semibold">{filteredMessages.length}</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterSubject}
              onChange={(e) => {
                setFilterSubject(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">Todos los asuntos</option>
              <option value="compra">Comprar obra</option>
              <option value="info">Información</option>
              <option value="exposicion">Exposiciones</option>
              <option value="encargo">Encargo personalizado</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Lista de mensajes */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay mensajes para mostrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Remitente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Asunto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Mensaje</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message._id || message.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      {(() => {
                        const statusInfo = getStatusInfo(message.status);
                        const Icon = statusInfo.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <Icon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(message.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="font-medium text-gray-900">{message.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        {message.phone && (
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <p className="text-sm text-gray-500">{message.phone}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(message.subject)}`}>
                        <Tag className="h-3 w-3 mr-1" />
                        {getSubjectLabel(message.subject)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {message.message}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver mensaje completo"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message._id || message.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar mensaje"
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
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Modal de mensaje completo */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detalle del Mensaje</h2>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre</label>
                  <p className="text-gray-900 font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p className="text-gray-900">
                    {formatDate(selectedMessage.createdAt, true)}
                  </p>
                </div>
              </div>
              
              {selectedMessage.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-gray-900">{selectedMessage.phone}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Asunto</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(selectedMessage.subject)} mt-1`}>
                    {getSubjectLabel(selectedMessage.subject)}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['new', 'read', 'replied', 'archived'].map((status) => {
                      const statusInfo = getStatusInfo(status);
                      const Icon = statusInfo.icon;
                      const isActive = selectedMessage.status === status;
                      
                      return (
                        <button
                          key={status}
                          onClick={() => handleChangeStatus(selectedMessage._id || selectedMessage.id, status)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isActive 
                              ? statusInfo.color 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={`Marcar como ${statusInfo.label}`}
                        >
                          <Icon className="h-4 w-4" />
                          {statusInfo.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mensaje</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  handleDeleteMessage(selectedMessage._id || selectedMessage.id);
                }}
                className="btn-danger flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar mensaje
              </button>
              <button
                onClick={() => setShowMessageModal(false)}
                className="btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Eliminar mensaje</h3>
                <p className="text-gray-600">¿Estás seguro de que deseas eliminar este mensaje?</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Esta acción no se puede deshacer. El mensaje será eliminado permanentemente.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMessageToDelete(null);
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="btn-danger"
              >
                Eliminar mensaje
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Messages;