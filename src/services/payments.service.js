import api from './api';
import { API_ENDPOINTS } from '../config/api';

class PaymentsService {
  // Crear intención de pago con Stripe
  async createPaymentIntent(amount, currency = 'ARS', metadata = {}) {
    try {
      const response = await api.post(API_ENDPOINTS.payments.createIntent, {
        amount,
        currency,
        metadata
      });
      return response;
    } catch (error) {
      console.error('Error al crear intención de pago:', error);
      throw error;
    }
  }

  // Confirmar pago
  async confirmPayment(paymentIntentId, paymentDetails) {
    try {
      const response = await api.post(API_ENDPOINTS.payments.confirm, {
        paymentIntentId,
        ...paymentDetails
      });
      return response;
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      throw error;
    }
  }

  // Obtener información de pago de una orden
  async getOrderPayment(orderId) {
    try {
      const response = await api.get(API_ENDPOINTS.payments.orderPayment(orderId));
      return response;
    } catch (error) {
      console.error('Error al obtener información de pago:', error);
      throw error;
    }
  }

  // Calcular total con impuestos y gastos de envío
  calculateTotal(subtotal, shippingCost = 0, taxRate = 0.21) {
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shippingCost * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  // Formatear cantidad para Stripe (convierte pesos a céntimos)
  formatAmountForStripe(amount) {
    return Math.round(amount * 100);
  }

  // Validar información de tarjeta (básica, Stripe hace la validación real)
  validateCardInfo(cardNumber, expiryMonth, expiryYear, cvc) {
    const errors = {};
    
    // Validar número de tarjeta (formato básico)
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Número de tarjeta inválido';
    }
    
    // Validar mes de expiración
    if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12) {
      errors.expiryMonth = 'Mes de expiración inválido';
    }
    
    // Validar año de expiración
    const currentYear = new Date().getFullYear();
    if (!expiryYear || expiryYear < currentYear) {
      errors.expiryYear = 'Año de expiración inválido';
    }
    
    // Validar CVC
    if (!cvc || cvc.length < 3 || cvc.length > 4) {
      errors.cvc = 'CVC inválido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Simular procesamiento de pago (para desarrollo)
  async processPaymentMock(orderData, paymentData) {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular diferentes resultados
    const random = Math.random();
    
    if (random > 0.9) {
      // 10% de probabilidad de error
      throw new Error('El pago fue rechazado por el banco');
    }
    
    return {
      success: true,
      data: {
        paymentId: `pi_${Date.now()}`,
        status: 'succeeded',
        amount: orderData.total,
        currency: 'ARS',
        createdAt: new Date().toISOString()
      }
    };
  }
}

export default new PaymentsService();