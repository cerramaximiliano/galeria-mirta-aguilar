import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2, Calendar } from 'lucide-react';
import siteInfoService from '../services/siteInfo.service';

const PrivacyPolicy = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await siteInfoService.getPrivacyPolicy();
      if (response.success) {
        setPolicy(response.data);
      }
    } catch (err) {
      setError('Error al cargar la política de privacidad');
      console.error('Error loading privacy policy:', err);
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

  // Contenido por defecto si no hay contenido en la BD
  const defaultContent = `
## 1. Información que Recopilamos

En nuestra galería de arte, recopilamos información personal que usted nos proporciona voluntariamente, incluyendo:

- **Información de contacto**: nombre, correo electrónico, número de teléfono
- **Información de envío**: dirección postal para la entrega de obras
- **Información de pago**: procesada de forma segura a través de nuestros proveedores de pago

## 2. Uso de la Información

Utilizamos la información recopilada para:

- Procesar y gestionar sus compras de obras de arte
- Enviar confirmaciones de pedidos y actualizaciones de envío
- Responder a sus consultas y solicitudes
- Enviar información sobre nuevas obras y exposiciones (si se suscribe al newsletter)
- Mejorar nuestros servicios y experiencia del usuario

## 3. Protección de Datos

Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.

## 4. Compartir Información

No vendemos ni compartimos su información personal con terceros, excepto cuando sea necesario para:

- Procesar pagos (proveedores de servicios de pago)
- Realizar envíos (empresas de mensajería)
- Cumplir con obligaciones legales

## 5. Sus Derechos

Usted tiene derecho a:

- Acceder a sus datos personales
- Rectificar información inexacta
- Solicitar la eliminación de sus datos
- Oponerse al procesamiento de sus datos
- Retirar su consentimiento en cualquier momento

## 6. Cookies

Utilizamos cookies para mejorar su experiencia de navegación. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.

## 7. Contacto

Para cualquier consulta relacionada con esta política de privacidad, puede contactarnos a través de nuestra página de contacto.

## 8. Cambios en esta Política

Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios serán publicados en esta página con la fecha de última actualización.
`;

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

  const content = policy?.content || defaultContent;
  const title = policy?.title || 'Política de Privacidad';

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
          <Shield className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gallery-900 mb-4">
          {title}
        </h1>
        {policy?.lastUpdated && (
          <div className="flex items-center justify-center gap-2 text-gallery-600">
            <Calendar className="h-4 w-4" />
            <span>Última actualización: {formatDate(policy.lastUpdated)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gallery-700">
            {content.split('\n').map((line, index) => {
              // Headers
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl font-serif font-bold text-gallery-900 mt-8 mb-4">
                    {line.replace('## ', '')}
                  </h2>
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

export default PrivacyPolicy;
