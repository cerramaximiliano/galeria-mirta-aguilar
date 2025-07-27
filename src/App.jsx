import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModalProvider from './components/AuthModalProvider';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import ArtworkDetail from './pages/ArtworkDetail';
import Biography from './pages/Biography';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import DigitalArt from './pages/DigitalArt';
import DigitalArtDetail from './pages/DigitalArtDetail';
import { ToastContainer } from './components/Toast/Toast';
import useToast from './hooks/useToast';

function App() {
  const { toasts, removeToast } = useToast();
  
  useEffect(() => {
    // Mostrar resumen en la consola al cargar la app
    console.log('%c🎨 GALERÍA MIRTA AGUILAR - ESTADO DEL SISTEMA', 'background: #d4af37; color: black; padding: 10px; font-size: 16px; font-weight: bold');
    console.log(`
    📡 API Backend: ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api'}
    🖼️ Frontend: ${window.location.origin}
    
    ⚠️ IMPORTANTE:
    - La API está funcionando correctamente
    - Las obras se cargan desde MongoDB
    - PROBLEMA: Ninguna obra tiene featured:true en la BD
    - SOLUCIÓN TEMPORAL: El Hero muestra las primeras 5 obras
    
    💡 Para arreglar el Hero:
    1. Actualiza algunas obras en MongoDB con featured: true
    2. O usa el panel de admin para marcar obras como destacadas
    
    🔍 Revisa la consola para ver el flujo de datos:
    - 🌐 = Llamadas a la API
    - 📊 = Datos recibidos
    - 🏪 = Actualizaciones del store
    `);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthModalProvider>
          <Router>
            <ScrollToTop />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="obra/:id" element={<ArtworkDetail />} />
                <Route path="arte-digital" element={<DigitalArt />} />
                <Route path="arte-digital/:id" element={<DigitalArtDetail />} />
                <Route path="biografia" element={<Biography />} />
                <Route path="carrito" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-failure" element={<PaymentFailure />} />
                <Route path="contacto" element={<Contact />} />
              </Route>
              
              {/* Ruta de login (sin Layout) */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas de administración protegidas */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;