import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Star,
  Users,
  Building2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import contactsService from '../../../../services/admin/contacts.service';
import ContactCard from './ContactCard';
import ContactForm from './ContactForm';
import ContactHistory from './ContactHistory';
import ConfirmModal from '../common/ConfirmModal';

const ContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    favorites: false
  });

  const types = [
    { value: '', label: 'Todos los tipos' },
    { value: 'client', label: 'Clientes' },
    { value: 'supplier', label: 'Proveedores' },
    { value: 'both', label: 'Ambos' }
  ];

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.favorites) params.favorites = true;

      const [contactsResponse, statsResponse] = await Promise.all([
        contactsService.getContacts(params),
        contactsService.getStats()
      ]);

      if (contactsResponse.success) {
        setContacts(contactsResponse.data || []);
      } else {
        setError(contactsResponse.message || 'Error al cargar los contactos');
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('Error de conexión al cargar los contactos');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleCreate = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleSave = async (contactData) => {
    try {
      setSaving(true);
      setError(null);

      let response;
      if (editingContact) {
        response = await contactsService.updateContact(editingContact._id, contactData);
      } else {
        response = await contactsService.createContact(contactData);
      }

      if (response.success) {
        setShowForm(false);
        setEditingContact(null);
        fetchContacts();
      } else {
        setError(response.message || 'Error al guardar el contacto');
      }
    } catch (err) {
      setError('Error de conexión al guardar el contacto');
      console.error('Error saving contact:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar contacto?',
      message: 'Esta acción no se puede deshacer. El contacto será eliminado permanentemente.',
      onConfirm: async () => {
        try {
          const response = await contactsService.deleteContact(id);
          if (response.success) {
            fetchContacts();
          } else {
            setError(response.message || 'Error al eliminar el contacto');
          }
        } catch (err) {
          setError('Error de conexión al eliminar el contacto');
          console.error('Error deleting contact:', err);
        }
      }
    });
  };

  const handleToggleFavorite = async (id) => {
    try {
      const response = await contactsService.toggleFavorite(id);
      if (response.success) {
        setContacts(prev => prev.map(contact =>
          contact._id === id ? { ...contact, isFavorite: !contact.isFavorite } : contact
        ));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await contactsService.toggleActive(id);
      if (response.success) {
        setContacts(prev => prev.map(contact =>
          contact._id === id ? { ...contact, isActive: !contact.isActive } : contact
        ));
      }
    } catch (err) {
      console.error('Error toggling active:', err);
    }
  };

  const handleViewHistory = (contact) => {
    setViewingHistory(contact);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gallery-900">Contactos</h2>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Contacto
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="flex items-center gap-2 text-gallery-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Total</span>
            </div>
            <p className="text-2xl font-bold text-gallery-900">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Clientes</span>
            </div>
            <p className="text-2xl font-bold text-gallery-900">{stats.clients || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Proveedores</span>
            </div>
            <p className="text-2xl font-bold text-gallery-900">{stats.suppliers || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <Star className="h-4 w-4" />
              <span className="text-sm">Favoritos</span>
            </div>
            <p className="text-2xl font-bold text-gallery-900">{stats.favorites || 0}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <ContactForm
            contact={editingContact}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={saving}
          />
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gallery-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar contactos..."
              className="input-field pl-10"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="input-field"
          >
            {types.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {/* Favorites Filter */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, favorites: !prev.favorites }))}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
              filters.favorites
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200'
            }`}
          >
            <Star className={`h-4 w-4 ${filters.favorites ? 'fill-yellow-500' : ''}`} />
            Solo favoritos
          </button>

          {/* Refresh */}
          <button
            onClick={fetchContacts}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-gallery-100 text-gallery-600 hover:bg-gallery-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 text-accent animate-spin" />
        </div>
      )}

      {/* Contacts Grid */}
      {!loading && (
        <>
          {contacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {contacts.map(contact => (
                  <ContactCard
                    key={contact._id}
                    contact={contact}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleActive={handleToggleActive}
                    onViewHistory={handleViewHistory}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 text-gallery-500">
              <p className="mb-2">No hay contactos para mostrar</p>
              <button
                onClick={handleCreate}
                className="text-accent hover:underline"
              >
                Crear el primer contacto
              </button>
            </div>
          )}
        </>
      )}

      {/* History Modal */}
      <AnimatePresence>
        {viewingHistory && (
          <ContactHistory
            contact={viewingHistory}
            onClose={() => setViewingHistory(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
        />
      </AnimatePresence>
    </div>
  );
};

export default ContactsManager;
