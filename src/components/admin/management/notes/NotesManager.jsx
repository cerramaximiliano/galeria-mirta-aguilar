import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  Archive,
  Pin,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import notesService from '../../../../services/admin/notes.service';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';

const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    showArchived: false,
    showPinned: false
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'general', label: 'General' },
    { value: 'idea', label: 'Idea' },
    { value: 'task', label: 'Tarea' },
    { value: 'reminder', label: 'Recordatorio' },
    { value: 'important', label: 'Importante' },
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Trabajo' }
  ];

  const priorities = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        sortBy,
        order: sortOrder
      };

      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.showArchived) params.archived = true;
      if (filters.showPinned) params.pinned = true;

      const response = await notesService.getNotes(params);

      if (response.success) {
        setNotes(response.data || []);
      } else {
        setError(response.message || 'Error al cargar las notas');
      }
    } catch (err) {
      setError('Error de conexión al cargar las notas');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const handleSave = async (noteData) => {
    try {
      setSaving(true);
      setError(null);

      let response;
      if (editingNote) {
        response = await notesService.updateNote(editingNote._id, noteData);
      } else {
        response = await notesService.createNote(noteData);
      }

      if (response.success) {
        setShowForm(false);
        setEditingNote(null);
        fetchNotes();
      } else {
        setError(response.message || 'Error al guardar la nota');
      }
    } catch (err) {
      setError('Error de conexión al guardar la nota');
      console.error('Error saving note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta nota?')) return;

    try {
      const response = await notesService.deleteNote(id);
      if (response.success) {
        fetchNotes();
      } else {
        setError(response.message || 'Error al eliminar la nota');
      }
    } catch (err) {
      setError('Error de conexión al eliminar la nota');
      console.error('Error deleting note:', err);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const response = await notesService.togglePin(id);
      if (response.success) {
        setNotes(prev => prev.map(note =>
          note._id === id ? { ...note, isPinned: !note.isPinned } : note
        ));
      }
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      const response = await notesService.toggleArchive(id);
      if (response.success) {
        fetchNotes();
      }
    } catch (err) {
      console.error('Error toggling archive:', err);
    }
  };

  const handleAddAttachment = async (noteId, file) => {
    try {
      const response = await notesService.addAttachment(noteId, file);
      if (response.success) {
        setEditingNote(response.data);
        fetchNotes();
      }
    } catch (err) {
      console.error('Error adding attachment:', err);
    }
  };

  const handleRemoveAttachment = async (noteId, attachmentId) => {
    try {
      const response = await notesService.removeAttachment(noteId, attachmentId);
      if (response.success) {
        setEditingNote(response.data);
        fetchNotes();
      }
    } catch (err) {
      console.error('Error removing attachment:', err);
    }
  };

  // Separar notas fijadas de las demás
  const pinnedNotes = notes.filter(n => n.isPinned && !n.isArchived);
  const regularNotes = notes.filter(n => !n.isPinned && (!n.isArchived || filters.showArchived));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gallery-900">Mis Notas</h2>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva Nota
        </button>
      </div>

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
          <NoteForm
            note={editingNote}
            onSave={handleSave}
            onCancel={handleCancel}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
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
              placeholder="Buscar notas..."
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="input-field"
          >
            {priorities.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, showPinned: !prev.showPinned }))}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm transition-colors ${
                filters.showPinned
                  ? 'bg-accent text-white'
                  : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200'
              }`}
            >
              <Pin className="h-4 w-4" />
              Fijadas
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, showArchived: !prev.showArchived }))}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm transition-colors ${
                filters.showArchived
                  ? 'bg-accent text-white'
                  : 'bg-gallery-100 text-gallery-600 hover:bg-gallery-200'
              }`}
            >
              <Archive className="h-4 w-4" />
              Archivadas
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gallery-100">
          <span className="text-sm text-gallery-600">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto"
          >
            <option value="createdAt">Fecha de creación</option>
            <option value="updatedAt">Última modificación</option>
            <option value="priority">Prioridad</option>
            <option value="title">Título</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-md bg-gallery-100 text-gallery-600 hover:bg-gallery-200"
          >
            <SortAsc className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={fetchNotes}
            className="p-2 rounded-md bg-gallery-100 text-gallery-600 hover:bg-gallery-200 ml-auto"
            title="Recargar"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 text-accent animate-spin" />
        </div>
      )}

      {/* Notes Grid */}
      {!loading && (
        <>
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && !filters.showArchived && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gallery-600 mb-3 flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Notas fijadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {regularNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {regularNotes.map(note => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTogglePin={handleTogglePin}
                    onToggleArchive={handleToggleArchive}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            !pinnedNotes.length && (
              <div className="text-center py-12 text-gallery-500">
                <p className="mb-2">No hay notas para mostrar</p>
                <button
                  onClick={handleCreate}
                  className="text-accent hover:underline"
                >
                  Crear la primera nota
                </button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default NotesManager;
