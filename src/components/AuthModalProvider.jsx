import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

const AuthModalProvider = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRetry, setPendingRetry] = useState(null);

  useEffect(() => {
    const handleAuthRequired = (event) => {
      setShowAuthModal(true);
      setPendingRetry(() => event.detail.retry);
    };

    window.addEventListener('auth-required', handleAuthRequired);

    return () => {
      window.removeEventListener('auth-required', handleAuthRequired);
    };
  }, []);

  const handleAuthSuccess = () => {
    // Si hay una petición pendiente, reintentarla
    if (pendingRetry) {
      pendingRetry();
      setPendingRetry(null);
    }
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
    setPendingRetry(null);
  };

  return (
    <>
      {children}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default AuthModalProvider;