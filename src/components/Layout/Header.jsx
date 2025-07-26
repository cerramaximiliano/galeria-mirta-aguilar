import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import useCartStore from '../../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from '../Cart/CartDrawer';
import useCartDrawer from '../../hooks/useCartDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.getTotalItems());
  const location = useLocation();
  const { isOpen: isCartOpen, openDrawer, closeDrawer } = useCartDrawer();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Galería' },
    { path: '/arte-digital', label: 'Arte Digital' },
    { path: '/biografia', label: 'Biografía' },
    { path: '/contacto', label: 'Contacto' },
  ];

  return (
    <>
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled || isMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-soft py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="group"
          >
            <h1 className={`font-serif text-2xl md:text-3xl font-bold transition-all duration-300 ${
              isScrolled ? 'text-gallery-900' : 'text-gallery-900'
            }`}>
              <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                Mirta
              </span>{' '}
              <span className="inline-block transition-transform duration-300 group-hover:scale-105 text-accent">
                Susana
              </span>{' '}
              <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                Aguilar
              </span>
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <span className={`font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-gallery-900'
                    : 'text-gallery-600 hover:text-gallery-900'
                }`}>
                  {link.label}
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"
                  initial={false}
                  animate={{
                    scaleX: location.pathname === link.path ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-6">
            <button 
              onClick={openDrawer}
              className="relative group"
            >
              <div className="relative">
                <ShoppingCart className={`h-6 w-6 transition-all duration-300 ${
                  isScrolled ? 'text-gallery-700' : 'text-gallery-700'
                } group-hover:text-gallery-900 group-hover:scale-110`} />
                <AnimatePresence>
                  {cartItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2.5 -right-2.5 bg-accent text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg"
                    >
                      {cartItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>

            <button
              className="lg:hidden btn-icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gallery-700" />
              ) : (
                <Menu className="h-6 w-6 text-gallery-700" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg"
            >
              <div className="py-6 px-4 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`block text-lg font-medium transition-colors py-2 px-3 rounded-lg ${
                        location.pathname === link.path
                          ? 'text-gallery-900 bg-gallery-100'
                          : 'text-gallery-700 hover:text-gallery-900 hover:bg-gallery-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
    
    {/* Cart Drawer */}
    <CartDrawer isOpen={isCartOpen} onClose={closeDrawer} />
    </>
  );
};

export default Header;