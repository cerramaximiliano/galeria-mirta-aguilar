import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, User, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import { formatPrice } from '../utils/formatters';
import useToast from '../hooks/useToast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCartStore();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos personales, 2: Envío, 3: Pago
  
  // Form data
  const [formData, setFormData] = useState({
    // Datos personales
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dni: '',
    
    // Datos de envío
    shippingMethod: 'pickup', // pickup or delivery
    address: '',
    city: '',
    province: '',
    postalCode: '',
    shippingNotes: '',
    
    // Datos de facturación
    billingType: 'consumidor_final', // consumidor_final or factura_a
    businessName: '',
    cuit: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrito');
    }
  }, [items.length, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      // Validar datos personales
      if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      if (!formData.dni.trim()) newErrors.dni = 'El DNI es requerido';
    }

    if (stepNumber === 2) {
      // Validar datos de envío
      if (formData.shippingMethod === 'delivery') {
        if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
        if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
        if (!formData.province.trim()) newErrors.province = 'La provincia es requerida';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'El código postal es requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Preparar datos del pedido
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: 1,
          currency: item.currency
        })),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dni: formData.dni
        },
        shipping: {
          method: formData.shippingMethod,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          notes: formData.shippingNotes
        },
        billing: {
          type: formData.billingType,
          businessName: formData.businessName,
          cuit: formData.cuit
        },
        total: getTotalPrice()
      };

      // Llamar a la API para crear la preferencia de MercadoPago
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010/api'}/checkout/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pedido');
      }

      const data = await response.json();
      
      // Redirigir a MercadoPago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('No se pudo obtener el link de pago');
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar el pedido. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const cartCurrency = items.length > 0 ? items[0].currency || 'ARS' : 'ARS';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gallery-50"
    >
      <div className="container-custom pt-32 pb-8">
        <button
          onClick={() => navigate('/carrito')}
          className="inline-flex items-center gap-2 text-gallery-600 hover:text-gallery-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver al carrito</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[
                  { number: 1, label: 'Datos personales', icon: User },
                  { number: 2, label: 'Envío', icon: Truck },
                  { number: 3, label: 'Pago', icon: CreditCard }
                ].map((s, index) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.number} className="flex items-center">
                      <div className={`flex items-center ${index < 2 ? 'flex-1' : ''}`}>
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${step >= s.number 
                            ? 'bg-accent text-white' 
                            : 'bg-gallery-200 text-gallery-500'}
                          transition-colors duration-300
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`ml-3 text-sm font-medium hidden sm:inline
                          ${step >= s.number ? 'text-gallery-900' : 'text-gallery-500'}
                        `}>
                          {s.label}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className={`flex-1 h-0.5 mx-4 sm:mx-6
                          ${step > s.number ? 'bg-accent' : 'bg-gallery-200'}
                          transition-colors duration-300
                        `} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Datos personales */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-gallery-900 mb-6">
                    Datos personales
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gallery-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Juan"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gallery-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Pérez"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gallery-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gallery-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gallery-700 mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gallery-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gallery-700 mb-2">
                        DNI *
                      </label>
                      <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        className={`input-field ${errors.dni ? 'border-red-500' : ''}`}
                        placeholder="12345678"
                      />
                      {errors.dni && (
                        <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
                      )}
                    </div>
                  </div>

                  {/* Tipo de facturación */}
                  <div>
                    <label className="block text-sm font-medium text-gallery-700 mb-3">
                      Tipo de facturación
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gallery-50 transition-colors">
                        <input
                          type="radio"
                          name="billingType"
                          value="consumidor_final"
                          checked={formData.billingType === 'consumidor_final'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="text-gallery-700">Consumidor Final</span>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gallery-50 transition-colors">
                        <input
                          type="radio"
                          name="billingType"
                          value="factura_a"
                          checked={formData.billingType === 'factura_a'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="text-gallery-700">Factura A</span>
                      </label>
                    </div>
                  </div>

                  {formData.billingType === 'factura_a' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gallery-700 mb-2">
                          Razón Social
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Mi Empresa S.A."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gallery-700 mb-2">
                          CUIT
                        </label>
                        <input
                          type="text"
                          name="cuit"
                          value={formData.cuit}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="20-12345678-9"
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Envío */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-gallery-900 mb-6">
                    Método de entrega
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gallery-50 transition-colors">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pickup"
                        checked={formData.shippingMethod === 'pickup'}
                        onChange={handleInputChange}
                        className="mr-3 mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gallery-900">Retiro en galería</div>
                        <div className="text-sm text-gallery-600 mt-1">
                          Gratis - Coordinaremos el día y horario de retiro
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gallery-50 transition-colors">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="delivery"
                        checked={formData.shippingMethod === 'delivery'}
                        onChange={handleInputChange}
                        className="mr-3 mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gallery-900">Envío a domicilio</div>
                        <div className="text-sm text-gallery-600 mt-1">
                          El costo se coordinará según la ubicación
                        </div>
                      </div>
                    </label>
                  </div>

                  {formData.shippingMethod === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 mt-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gallery-700 mb-2">
                          Dirección *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gallery-400" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`input-field pl-10 ${errors.address ? 'border-red-500' : ''}`}
                            placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                          />
                        </div>
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gallery-700 mb-2">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                            placeholder="Buenos Aires"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gallery-700 mb-2">
                            Provincia *
                          </label>
                          <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            className={`input-field ${errors.province ? 'border-red-500' : ''}`}
                            placeholder="Buenos Aires"
                          />
                          {errors.province && (
                            <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gallery-700 mb-2">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={`input-field ${errors.postalCode ? 'border-red-500' : ''}`}
                          placeholder="1234"
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gallery-700 mb-2">
                      Notas de envío (opcional)
                    </label>
                    <textarea
                      name="shippingNotes"
                      value={formData.shippingNotes}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      placeholder="Instrucciones especiales para la entrega..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmación y Pago */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-serif font-bold text-gallery-900 mb-6">
                    Confirmar pedido
                  </h2>

                  {/* Resumen de datos */}
                  <div className="space-y-4">
                    <div className="bg-gallery-50 rounded-lg p-4">
                      <h3 className="font-medium text-gallery-900 mb-3">Datos personales</h3>
                      <div className="space-y-1 text-sm text-gallery-700">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                        <p>DNI: {formData.dni}</p>
                      </div>
                    </div>

                    <div className="bg-gallery-50 rounded-lg p-4">
                      <h3 className="font-medium text-gallery-900 mb-3">Entrega</h3>
                      <div className="text-sm text-gallery-700">
                        {formData.shippingMethod === 'pickup' ? (
                          <p>Retiro en galería (a coordinar)</p>
                        ) : (
                          <div className="space-y-1">
                            <p>{formData.address}</p>
                            <p>{formData.city}, {formData.province} ({formData.postalCode})</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Información importante</p>
                          <p>
                            Al confirmar, serás redirigido a MercadoPago para completar el pago de forma segura.
                            Una vez completado el pago, recibirás un email con los detalles de tu compra.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={step > 1 ? handlePreviousStep : () => navigate('/carrito')}
                  className="btn-secondary"
                >
                  {step > 1 ? 'Anterior' : 'Cancelar'}
                </button>
                
                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="btn-primary"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Ir a pagar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gallery-900 mb-4">
                Resumen del pedido
              </h3>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.imageUrl || item.thumbnailUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gallery-900 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gallery-600">{item.artist}</p>
                      <p className="text-sm font-medium text-gallery-900 mt-1">
                        {formatPrice(item.price, item.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gallery-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(getTotalPrice(), cartCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gallery-600">Envío</span>
                  <span className="font-medium">
                    {formData.shippingMethod === 'pickup' ? 'Gratis' : 'A coordinar'}
                  </span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-gallery-900">
                    {formatPrice(getTotalPrice(), cartCurrency)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 text-gallery-500">
                <img 
                  src="https://www.mercadopago.com/org-img/MP3/home/logomp3.gif" 
                  alt="MercadoPago" 
                  className="h-8"
                />
                <span className="text-xs">Pago seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;