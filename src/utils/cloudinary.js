// Utilidades para optimizar URLs de Cloudinary.
// Inserta transformaciones de entrega (formato, calidad y ancho) en la URL
// sin tocar las transformaciones ya presentes en el public ID.

const UPLOAD_SEGMENT = '/image/upload/';

const isCloudinaryUrl = (url) =>
  typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes(UPLOAD_SEGMENT);

/**
 * Devuelve la URL con transformaciones de optimización de Cloudinary.
 * f_auto: entrega AVIF/WebP según el navegador.
 * q_auto: compresión automática perceptual.
 * w + c_limit: escala al ancho pedido sin agrandar la imagen original.
 * dpr_auto: ajusta a la densidad de píxeles del dispositivo.
 *
 * @param {string} url  URL original de Cloudinary
 * @param {number} [width]  Ancho máximo deseado en px CSS
 */
export const optimizeCloudinary = (url, width) => {
  if (!isCloudinaryUrl(url)) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (width) {
    transforms.push(`w_${width}`, 'c_limit', 'dpr_auto');
  }

  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transforms.join(',')}/`);
};

/**
 * Genera un srcSet con varios anchos para imágenes responsive.
 * @param {string} url  URL original de Cloudinary
 * @param {number[]} widths  Anchos a generar
 */
export const cloudinarySrcSet = (url, widths = [400, 600, 800, 1200]) => {
  if (!isCloudinaryUrl(url)) return undefined;

  return widths
    .map((w) => {
      const transformed = url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}f_auto,q_auto,w_${w},c_limit/`);
      return `${transformed} ${w}w`;
    })
    .join(', ');
};
