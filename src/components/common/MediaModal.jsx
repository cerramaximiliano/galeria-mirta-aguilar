import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, Loader2 } from 'lucide-react';

const MediaModal = ({ isOpen, onClose, url, title, caption }) => {
  // Detectar tipo de contenido por extensión
  const getMediaType = (url) => {
    if (!url) return 'unknown';
    const lowerUrl = url.toLowerCase();

    // Imágenes
    if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/)) {
      return 'image';
    }

    // PDFs
    if (lowerUrl.match(/\.pdf(\?.*)?$/)) {
      return 'pdf';
    }

    // URLs de Cloudinary u otros servicios de imágenes
    if (lowerUrl.includes('cloudinary.com') ||
        lowerUrl.includes('imgur.com') ||
        lowerUrl.includes('unsplash.com')) {
      return 'image';
    }

    // Si no podemos determinar, asumimos que es una página web
    return 'webpage';
  };

  const mediaType = getMediaType(url);

  // Cerrar con Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !url) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          {/* Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gallery-200 bg-gallery-50">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-gallery-900 truncate">
                  {title || 'Vista previa'}
                </h3>
                {caption && (
                  <p className="text-sm text-gallery-600 mt-1 line-clamp-2">
                    {caption}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Abrir en nueva pestaña */}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gallery-600 hover:text-gallery-900 hover:bg-gallery-200 rounded-lg transition-colors"
                  title="Abrir en nueva pestaña"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                {/* Descargar (solo para imágenes y PDFs) */}
                {(mediaType === 'image' || mediaType === 'pdf') && (
                  <a
                    href={url}
                    download
                    className="p-2 text-gallery-600 hover:text-gallery-900 hover:bg-gallery-200 rounded-lg transition-colors"
                    title="Descargar"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                )}
                {/* Cerrar */}
                <button
                  onClick={onClose}
                  className="p-2 text-gallery-600 hover:text-gallery-900 hover:bg-gallery-200 rounded-lg transition-colors"
                  title="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative overflow-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
              {mediaType === 'image' && (
                <div className="flex items-center justify-center min-h-[300px] p-4 bg-gallery-100">
                  <img
                    src={url}
                    alt={title || 'Imagen'}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden flex-col items-center justify-center text-gallery-500">
                    <p>No se pudo cargar la imagen</p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-accent hover:underline"
                    >
                      Abrir enlace externo
                    </a>
                  </div>
                </div>
              )}

              {mediaType === 'pdf' && (
                <div className="w-full h-[75vh]">
                  <iframe
                    src={`${url}#toolbar=1&navpanes=0`}
                    className="w-full h-full border-0"
                    title={title || 'Documento PDF'}
                  />
                </div>
              )}

              {mediaType === 'webpage' && (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                  <ExternalLink className="h-12 w-12 text-gallery-400 mb-4" />
                  <p className="text-gallery-700 mb-4">
                    Este enlace abre una página externa
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir enlace
                  </a>
                </div>
              )}

              {mediaType === 'unknown' && (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                  <Loader2 className="h-8 w-8 text-gallery-400 animate-spin mb-4" />
                  <p className="text-gallery-600">Cargando contenido...</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaModal;
