import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModalProvider from './components/AuthModalProvider';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import { ToastContainer } from './components/Toast/Toast';
import useToast from './hooks/useToast';

// Code-splitting: cada página secundaria se descarga solo cuando se navega a ella.
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'));
const Biography = lazy(() => import('./pages/Biography'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const DigitalArt = lazy(() => import('./pages/DigitalArt'));
const DigitalArtDetail = lazy(() => import('./pages/DigitalArtDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-4 border-gallery-200 border-t-accent animate-spin" />
  </div>
);

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthModalProvider>
          <Router>
            <ScrollToTop />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <Suspense fallback={<PageLoader />}>
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
                <Route path="privacidad" element={<PrivacyPolicy />} />
                <Route path="terminos" element={<TermsAndConditions />} />
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
            </Suspense>
          </Router>
        </AuthModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;