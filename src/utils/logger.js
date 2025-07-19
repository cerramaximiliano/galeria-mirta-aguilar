// Logger utility para debugging de la aplicación

const logger = {
  apiCall: (method, url, data) => {
    console.group(`🌐 API Call: ${method} ${url}`);
    console.log('📤 Request Data:', data);
    console.groupEnd();
  },

  apiResponse: (url, response) => {
    console.group(`✅ API Response: ${url}`);
    console.log('📥 Response:', response);
    console.groupEnd();
  },

  apiError: (url, error) => {
    console.group(`❌ API Error: ${url}`);
    console.error('🚨 Error:', error);
    console.groupEnd();
  },

  storeUpdate: (storeName, action, data) => {
    console.group(`🏪 Store Update: ${storeName}`);
    console.log(`🎯 Action: ${action}`);
    console.log('📊 Data:', data);
    console.groupEnd();
  },

  summary: () => {
    console.log('%c=== RESUMEN DEL ESTADO DE LA APLICACIÓN ===', 'background: #4a5568; color: white; padding: 5px; font-weight: bold');
    console.log(`
    🔧 CONFIGURACIÓN:
    - API URL: http://localhost:5010/api
    - Modo: ${window.artworksService?.useMockData ? 'DATOS LOCALES' : 'API BACKEND'}
    
    📊 PROBLEMAS CONOCIDOS:
    - Ninguna obra en la BD tiene featured: true
    - Por eso el Hero muestra las primeras 5 obras
    
    ✅ SOLUCIÓN:
    - Actualizar algunas obras en MongoDB con featured: true
    - O usar el admin panel para marcar obras como destacadas
    `);
  }
};

export default logger;