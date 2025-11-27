import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import siteInfoService from '../services/siteInfo.service';

const TermsAndConditions = () => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await siteInfoService.getTermsAndConditions();
      if (response.success) {
        setTerms(response.data);
      }
    } catch (err) {
      setError('Error al cargar los términos y condiciones');
      console.error('Error loading terms:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-custom pt-40 pb-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom pt-40 pb-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Si no hay contenido en la BD
  if (!terms?.content) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container-custom pt-40 pb-12"
      >
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gallery-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-gallery-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gallery-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-gallery-600 mb-6">
            El contenido de esta página está siendo actualizado.
          </p>
          <Link to="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    );
  }

  const content = terms.content;
  const title = terms.title || 'Términos y Condiciones';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-custom pt-40 pb-12"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
          <FileText className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gallery-900 mb-4">
          {title}
        </h1>
        {terms?.lastUpdated && (
          <div className="flex items-center justify-center gap-2 text-gallery-600">
            <Calendar className="h-4 w-4" />
            <span>Última actualización: {formatDate(terms.lastUpdated)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gallery-700">
            {content.split('\n').map((line, index) => {
              // H2 Headers
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl font-serif font-bold text-gallery-900 mt-8 mb-4">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              // H3 Headers
              if (line.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-lg font-semibold text-gallery-800 mt-6 mb-3">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              // Bold items (list items starting with -)
              if (line.trim().startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
                if (match) {
                  return (
                    <p key={index} className="ml-4 mb-2">
                      <strong className="text-gallery-900">{match[1]}</strong>
                      {match[2] && `: ${match[2]}`}
                    </p>
                  );
                }
              }
              // Regular list items
              if (line.trim().startsWith('- ')) {
                return (
                  <p key={index} className="ml-4 mb-2">
                    • {line.replace('- ', '')}
                  </p>
                );
              }
              // Regular paragraphs
              if (line.trim()) {
                return (
                  <p key={index} className="mb-4 leading-relaxed">
                    {line}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions;
