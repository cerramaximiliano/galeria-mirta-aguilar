import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Calendar } from 'lucide-react';
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

  // Contenido por defecto si no hay contenido en la BD
  const defaultContent = `
## 1. Aceptación de los Términos

Al acceder y utilizar este sitio web de galería de arte, usted acepta cumplir con estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice nuestro sitio.

## 2. Descripción del Servicio

Este sitio web ofrece:

- Exhibición y venta de obras de arte originales
- Venta de reproducciones digitales de arte
- Información sobre la artista y su trayectoria
- Servicio de contacto para consultas y encargos especiales

## 3. Compras y Pagos

### 3.1 Precios
- Los precios mostrados están expresados en Pesos Argentinos (ARS)
- Los precios pueden estar sujetos a cambios sin previo aviso
- El precio aplicable será el vigente al momento de realizar la compra

### 3.2 Métodos de Pago
- Aceptamos pagos a través de MercadoPago
- Todas las transacciones son procesadas de forma segura

### 3.3 Confirmación de Compra
- Recibirá una confirmación por correo electrónico una vez procesado el pago
- La compra está sujeta a disponibilidad del producto

## 4. Envíos y Entregas

- Los envíos se realizan a todo el territorio argentino
- Los tiempos de entrega varían según la ubicación
- El comprador es responsable de proporcionar una dirección de envío correcta
- Las obras originales se envían con embalaje especial para su protección

## 5. Devoluciones y Reembolsos

### 5.1 Obras Originales
- Se aceptan devoluciones dentro de los 7 días posteriores a la recepción
- La obra debe estar en perfectas condiciones y con su embalaje original
- Los gastos de envío de devolución corren por cuenta del comprador

### 5.2 Arte Digital
- Las reproducciones digitales no admiten devolución una vez procesada la impresión
- En caso de defectos de fabricación, se procederá al reemplazo sin costo adicional

## 6. Propiedad Intelectual

- Todas las obras de arte mostradas son propiedad intelectual de Mirta Aguilar
- Está prohibida la reproducción no autorizada de las imágenes
- La compra de una obra no transfiere los derechos de autor

## 7. Uso del Sitio

El usuario se compromete a:

- Proporcionar información veraz y actualizada
- No utilizar el sitio para fines ilegales
- No intentar acceder a áreas restringidas del sitio
- Respetar los derechos de propiedad intelectual

## 8. Limitación de Responsabilidad

No nos hacemos responsables por:

- Daños indirectos derivados del uso del sitio
- Interrupciones temporales del servicio
- Errores tipográficos en descripciones o precios (que serán corregidos)

## 9. Modificaciones

Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en el sitio.

## 10. Legislación Aplicable

Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será sometida a los tribunales competentes de la Ciudad de Buenos Aires.

## 11. Contacto

Para cualquier consulta sobre estos términos, puede contactarnos a través de nuestra página de contacto.
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

  const content = terms?.content || defaultContent;
  const title = terms?.title || 'Términos y Condiciones';

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
