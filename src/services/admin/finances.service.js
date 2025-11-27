import api from '../api';
import { API_ENDPOINTS } from '../../config/api';

const financesService = {
  // Obtener transacciones
  async getTransactions(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.finances.transactions, params);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener una transacción
  async getTransaction(id) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.finances.transactionDetail(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Crear transacción
  async createTransaction(data) {
    try {
      const response = await api.post(API_ENDPOINTS.admin.finances.createTransaction, data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar transacción
  async updateTransaction(id, data) {
    try {
      const response = await api.put(API_ENDPOINTS.admin.finances.updateTransaction(id), data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar transacción
  async deleteTransaction(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.admin.finances.deleteTransaction(id));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener resumen financiero
  async getSummary(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.finances.summary, params);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener desglose por categoría
  async getCategoryBreakdown(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.finances.categoryBreakdown, params);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener comparación anual
  async getYearlyComparison(year) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.finances.yearlyComparison, { year });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener presupuestos
  async getBudgets(year) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.finances.budgets, { year });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener presupuesto de un mes
  async getBudget(year, month) {
    try {
      const response = await api.get(API_ENDPOINTS.admin.finances.budget(year, month));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Crear/actualizar presupuesto
  async saveBudget(year, month, data) {
    try {
      const response = await api.put(API_ENDPOINTS.admin.finances.budget(year, month), data);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Sincronizar presupuesto con gastos reales
  async syncBudget(year, month) {
    try {
      const response = await api.post(API_ENDPOINTS.admin.finances.syncBudget(year, month));
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

export default financesService;
