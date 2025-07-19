import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = authService.getStoredUser();
    if (savedUser) {
      setUser(savedUser);
      // Verificar que el token siga siendo válido
      authService.getCurrentUser().then(currentUser => {
        if (currentUser) {
          setUser({ ...savedUser, ...currentUser });
        } else {
          // Token inválido, limpiar
          authService.logout();
          setUser(null);
        }
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        // Actualizar el token en localStorage para que el API service lo use
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Error al conectar con el servidor' };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshToken = async () => {
    const success = await authService.refreshToken();
    if (!success) {
      setUser(null);
    }
    return success;
  };

  const value = {
    user,
    login,
    logout,
    refreshToken,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};