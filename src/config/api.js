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
  health: '/health',

  // Admin Management
  admin: {
    // Notes
    notes: {
      list: '/admin/notes',
      urgent: '/admin/notes/urgent',
      detail: (id) => `/admin/notes/${id}`,
      create: '/admin/notes',
      update: (id) => `/admin/notes/${id}`,
      delete: (id) => `/admin/notes/${id}`,
      togglePin: (id) => `/admin/notes/${id}/pin`,
      toggleArchive: (id) => `/admin/notes/${id}/archive`,
      addAttachment: (id) => `/admin/notes/${id}/attachments`,
      removeAttachment: (id, attachmentId) => `/admin/notes/${id}/attachments/${attachmentId}`
    },
    // Contacts
    contacts: {
      list: '/admin/contacts',
      stats: '/admin/contacts/stats',
      detail: (id) => `/admin/contacts/${id}`,
      create: '/admin/contacts',
      update: (id) => `/admin/contacts/${id}`,
      delete: (id) => `/admin/contacts/${id}`,
      toggleFavorite: (id) => `/admin/contacts/${id}/favorite`,
      toggleActive: (id) => `/admin/contacts/${id}/active`,
      addHistory: (id) => `/admin/contacts/${id}/history`,
      removeHistory: (id, historyId) => `/admin/contacts/${id}/history/${historyId}`
    },
    // Finances
    finances: {
      transactions: '/admin/finances/transactions',
      transactionDetail: (id) => `/admin/finances/transactions/${id}`,
      createTransaction: '/admin/finances/transactions',
      updateTransaction: (id) => `/admin/finances/transactions/${id}`,
      deleteTransaction: (id) => `/admin/finances/transactions/${id}`,
      summary: '/admin/finances/summary',
      categoryBreakdown: '/admin/finances/category-breakdown',
      yearlyComparison: '/admin/finances/yearly-comparison',
      budgets: '/admin/finances/budgets',
      budget: (year, month) => `/admin/finances/budgets/${year}/${month}`,
      syncBudget: (year, month) => `/admin/finances/budgets/${year}/${month}/sync`
    },
    // Agenda
    agenda: {
      events: '/admin/agenda/events',
      upcomingEvents: '/admin/agenda/events/upcoming',
      todayEvents: '/admin/agenda/events/today',
      eventDetail: (id) => `/admin/agenda/events/${id}`,
      createEvent: '/admin/agenda/events',
      updateEvent: (id) => `/admin/agenda/events/${id}`,
      deleteEvent: (id) => `/admin/agenda/events/${id}`,
      updateEventStatus: (id) => `/admin/agenda/events/${id}/status`,
      calendar: (year, month) => `/admin/agenda/calendar/${year}/${month}`,
      tasks: '/admin/agenda/tasks',
      taskStats: '/admin/agenda/tasks/stats',
      pendingTasks: '/admin/agenda/tasks/pending',
      taskDetail: (id) => `/admin/agenda/tasks/${id}`,
      createTask: '/admin/agenda/tasks',
      updateTask: (id) => `/admin/agenda/tasks/${id}`,
      deleteTask: (id) => `/admin/agenda/tasks/${id}`,
      updateTaskStatus: (id) => `/admin/agenda/tasks/${id}/status`,
      toggleChecklistItem: (taskId, itemIndex) => `/admin/agenda/tasks/${taskId}/checklist/${itemIndex}`
    }
  }
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