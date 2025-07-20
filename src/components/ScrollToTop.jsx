import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si no hay hash, hacer scroll hacia arriba
    if (!hash) {
      // Usar un pequeño timeout para asegurar que el DOM esté actualizado
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' // Usamos 'instant' para que sea inmediato
        });
      }, 0);
    } else {
      // Si hay un hash, intentar hacer scroll al elemento
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  }, [pathname, hash]);

  // Este componente no renderiza nada
  return null;
}

export default ScrollToTop;