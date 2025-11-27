import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, MapPin, Loader2, ExternalLink, FileText } from 'lucide-react';
import siteInfoService from '../services/siteInfo.service';
import BiographySkeleton from '../components/Skeleton/BiographySkeleton';

const Biography = () => {
  const [biography, setBiography] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBiography();
  }, []);

  const fetchBiography = async () => {
    try {
      const response = await siteInfoService.getBiography();
      if (response.success) {
        setBiography(response.data);
      }
    } catch (err) {
      setError('Error al cargar la biografía');
      console.error('Error loading biography:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <BiographySkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!biography) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gallery-600">No se encontró información biográfica.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-custom pt-40 pb-12"
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gallery-900 mb-4">
          {biography.title}
        </h1>
        {biography.subtitle && (
          <p className="text-xl text-gallery-600">{biography.subtitle}</p>
        )}
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="md:col-span-1">
          {biography.profileImage?.url && (
            <img
              src={biography.profileImage.url}
              alt={biography.profileImage.alt || biography.title}
              className="w-full rounded-xl shadow-lg object-cover aspect-square"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div className="prose prose-lg max-w-none text-gallery-700">
            {biography.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      {biography.highlights && biography.highlights.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-serif font-bold text-gallery-900 mb-8 text-center">
            Hitos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {biography.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-soft p-6 flex items-start space-x-4"
              >
                <Calendar className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <span className="font-semibold text-gallery-900">{highlight.year}</span>
                  <p className="text-gallery-700 mt-1">{highlight.achievement}</p>
                  {highlight.externalUrl && (
                    <a
                      href={highlight.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 mt-2 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver más
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Exhibitions Section */}
      {biography.exhibitions && biography.exhibitions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-serif font-bold text-gallery-900 mb-8 text-center">
            Exposiciones
          </h2>
          <div className="space-y-6">
            {biography.exhibitions.map((exhibition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gallery-900">
                    {exhibition.title}
                  </h3>
                  <span className="text-accent font-medium">{exhibition.year}</span>
                </div>
                <div className="flex items-center text-gallery-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{exhibition.location}</span>
                </div>
                {exhibition.description && (
                  <p className="text-gallery-700">{exhibition.description}</p>
                )}
                {(exhibition.externalUrl || exhibition.catalogUrl) && (
                  <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gallery-100">
                    {exhibition.externalUrl && (
                      <a
                        href={exhibition.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ver más
                      </a>
                    )}
                    {exhibition.catalogUrl && (
                      <a
                        href={exhibition.catalogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Ver catálogo
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Awards Section */}
      {biography.awards && biography.awards.length > 0 && (
        <section>
          <h2 className="text-3xl font-serif font-bold text-gallery-900 mb-8 text-center">
            Premios y Reconocimientos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {biography.awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 text-center"
              >
                <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-gallery-900 mb-2">{award.title}</h3>
                <p className="text-gallery-600 text-sm mb-1">{award.organization}</p>
                <span className="text-accent font-medium">{award.year}</span>
                {(award.externalUrl || award.certificateUrl) && (
                  <div className="flex flex-wrap justify-center gap-3 mt-3 pt-3 border-t border-accent/20">
                    {award.externalUrl && (
                      <a
                        href={award.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ver más
                      </a>
                    )}
                    {award.certificateUrl && (
                      <a
                        href={award.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Certificado
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Biography;