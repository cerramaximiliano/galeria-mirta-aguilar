// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api';

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me'
  },
  
  // Artworks
  artworks: {
    list: '/artworks',
    detail: (id) => `/artworks/${id}`,
    create: '/artworks',
    update: (id) => `/artworks/${id}`,
    delete: (id) => `/artworks/${id}`,
    updateStatus: (id) => `/artworks/${id}/status`
  },
  
  // Orders
  orders: {
    create: '/orders',
    list: '/orders',
    detail: (id) => `/orders/${id}`,
    updateStatus: (id) => `/orders/${id}/status`
  },
  
  // Payments
  payments: {
    createIntent: '/payments/create-intent',
    confirm: '/payments/confirm',
    orderPayment: (orderId) => `/payments/order/${orderId}`
  },
  
  // Stats
  stats: {
    dashboard: '/stats/dashboard',
    sales: '/stats/sales',
    artworks: '/stats/artworks'
  },
  
  // Contact
  contact: '/contact',
  
  // Newsletter
  newsletter: {
    subscribe: '/newsletter/subscribe',
    unsubscribe: (email) => `/newsletter/unsubscribe/${email}`,
    subscribers: '/newsletter/subscribers'
  },
  
  // Upload
  upload: {
    image: '/upload/image',
    deleteImage: (id) => `/upload/image/${id}`
  },
  
  // Site Info
  siteinfo: {
    getAll: '/siteinfo',
    getBiography: '/siteinfo/biography',
    getContact: '/siteinfo/contact',
    update: '/siteinfo',
    getLegalPages: '/siteinfo/legal',
    getPrivacyPolicy: '/siteinfo/legal/privacy',
    getTermsAndConditions: '/siteinfo/legal/terms',
    updatePrivacyPolicy: '/siteinfo/legal/privacy',
    updateTermsAndConditions: '/siteinfo/legal/terms'
  },
  
  // Health
  health: '/health'
};

// Helper para construir URLs completas
export const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};