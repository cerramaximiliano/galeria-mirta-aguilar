import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gallery-900">
            {title}
          </h3>
        </div>
        
        <p className="text-gallery-600 mb-6 ml-15">
          {message}
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="btn-secondary btn-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger btn-sm"
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmDialog;