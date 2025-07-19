// Utilidades para formatear datos en la aplicación

/**
 * Formatea un precio con el símbolo de moneda
 * @param {number} price - El precio a formatear
 * @param {string} currency - La moneda (por defecto ARS)
 * @returns {string} El precio formateado
 */
export const formatPrice = (price, currency = 'ARS') => {
  // Formatear el número con separadores de miles
  const formattedNumber = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
  
  return `${currency} ${formattedNumber}`;
};

/**
 * Calcula el precio con descuento
 * @param {number} price - El precio original
 * @param {number} discount - El porcentaje de descuento
 * @returns {number} El precio con descuento aplicado
 */
export const calculateDiscountedPrice = (price, discount) => {
  if (!discount || discount === 0) return price;
  return price - (price * discount / 100);
};

/**
 * Calcula el precio original desde el precio final con descuento
 * @param {number} finalPrice - El precio final (con descuento aplicado)
 * @param {number} discountPercentage - El porcentaje de descuento
 * @returns {number} El precio original sin descuento
 */
export const calculateOriginalPrice = (finalPrice, discountPercentage) => {
  if (!discountPercentage || discountPercentage === 0) {
    return finalPrice;
  }
  // finalPrice = originalPrice * (1 - discount/100)
  // originalPrice = finalPrice / (1 - discount/100)
  return Math.round(finalPrice / (1 - discountPercentage / 100));
};