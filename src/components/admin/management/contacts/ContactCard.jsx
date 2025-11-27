import { motion } from 'framer-motion';
import {
  Star,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  ShoppingBag,
  Package,
  CheckCircle,
  XCircle,
  History
} from 'lucide-react';

const typeLabels = {
  client: 'Cliente',
  supplier: 'Proveedor',
  both: 'Cliente/Proveedor'
};

const typeColors = {
  client: 'bg-blue-100 text-blue-800',
  supplier: 'bg-purple-100 text-purple-800',
  both: 'bg-indigo-100 text-indigo-800'
};

const categoryLabels = {
  collector: 'Coleccionista',
  gallery: 'Galería',
  museum: 'Museo',
  art_dealer: 'Marchante',
  materials: 'Materiales',
  services: 'Servicios',
  framing: 'Enmarcado',
  printing: 'Impresión',
  other: 'Otro'
};

const ContactCard = ({ contact, onEdit, onDelete, onToggleFavorite, onToggleActive, onViewHistory }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-lg shadow-soft overflow-hidden ${
        !contact.isActive ? 'opacity-60' : ''
      } ${contact.isFavorite ? 'ring-2 ring-yellow-400' : ''}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gallery-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              contact.type === 'client' ? 'bg-blue-100' :
              contact.type === 'supplier' ? 'bg-purple-100' : 'bg-indigo-100'
            }`}>
              {contact.type === 'supplier' ? (
                <Building2 className="h-5 w-5 text-purple-600" />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gallery-900 flex items-center gap-2">
                {contact.name}
                {contact.isFavorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </h3>
              {contact.company && (
                <p className="text-sm text-gallery-500">{contact.company}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[contact.type]}`}>
              {typeLabels[contact.type]}
            </span>
            {contact.isActive ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-4 space-y-2">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm text-gallery-600">
            <Mail className="h-4 w-4 text-gallery-400" />
            <a href={`mailto:${contact.email}`} className="hover:text-accent">
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm text-gallery-600">
            <Phone className="h-4 w-4 text-gallery-400" />
            <a href={`tel:${contact.phone}`} className="hover:text-accent">
              {contact.phone}
            </a>
          </div>
        )}
        {contact.address?.city && (
          <div className="flex items-center gap-2 text-sm text-gallery-600">
            <MapPin className="h-4 w-4 text-gallery-400" />
            <span>
              {[contact.address.city, contact.address.province, contact.address.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Category */}
        {contact.category && (
          <div className="pt-2">
            <span className="text-xs bg-gallery-100 text-gallery-600 px-2 py-1 rounded-full">
              {categoryLabels[contact.category] || contact.category}
            </span>
          </div>
        )}

        {/* Stats - Transaction totals */}
        {contact.transactionTotals && (contact.transactionTotals.incomeCount > 0 || contact.transactionTotals.expenseCount > 0) && (
          <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-gallery-100">
            {(contact.type === 'client' || contact.type === 'both') && contact.transactionTotals.incomeCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4 text-green-500" />
                  <span className="text-gallery-600">
                    {contact.transactionTotals.incomeCount} ventas
                  </span>
                </div>
                <span className="font-medium text-green-600">
                  {formatCurrency(contact.transactionTotals.income)}
                </span>
              </div>
            )}
            {(contact.type === 'supplier' || contact.type === 'both') && contact.transactionTotals.expenseCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-red-500" />
                  <span className="text-gallery-600">
                    {contact.transactionTotals.expenseCount} gastos
                  </span>
                </div>
                <span className="font-medium text-red-600">
                  {formatCurrency(contact.transactionTotals.expense)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes preview */}
      {contact.notes && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gallery-500 line-clamp-2 italic">
            "{contact.notes}"
          </p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="px-4 py-3 bg-gallery-50 flex items-center justify-between">
        <span className="text-xs text-gallery-400">
          Creado: {formatDate(contact.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(contact._id)}
            className={`p-1.5 rounded-md transition-colors ${
              contact.isFavorite
                ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                : 'text-gallery-400 hover:text-yellow-500 hover:bg-gallery-100'
            }`}
            title={contact.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Star className={`h-4 w-4 ${contact.isFavorite ? 'fill-yellow-500' : ''}`} />
          </button>
          <button
            onClick={() => onToggleActive(contact._id)}
            className={`p-1.5 rounded-md transition-colors ${
              contact.isActive
                ? 'text-green-500 hover:bg-green-50'
                : 'text-gallery-400 hover:text-green-500 hover:bg-gallery-100'
            }`}
            title={contact.isActive ? 'Desactivar' : 'Activar'}
          >
            {contact.isActive ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onViewHistory && onViewHistory(contact)}
            className="p-1.5 rounded-md text-gallery-400 hover:text-accent hover:bg-gallery-100 transition-colors"
            title="Ver historial"
          >
            <History className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(contact)}
            className="p-1.5 rounded-md text-gallery-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(contact._id)}
            className="p-1.5 rounded-md text-gallery-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;
