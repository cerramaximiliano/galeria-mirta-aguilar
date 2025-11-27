import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart
} from 'lucide-react';

const categoryLabels = {
  artwork_sale: 'Venta de obra',
  commission: 'Comisión',
  workshop: 'Taller/Curso',
  grant: 'Beca/Subsidio',
  royalties: 'Regalías',
  materials: 'Materiales',
  studio: 'Estudio/Alquiler',
  marketing: 'Marketing',
  shipping: 'Envíos',
  taxes: 'Impuestos',
  services: 'Servicios',
  equipment: 'Equipamiento',
  travel: 'Viajes',
  other: 'Otro'
};

const categoryColors = {
  artwork_sale: 'bg-green-500',
  commission: 'bg-emerald-500',
  workshop: 'bg-teal-500',
  grant: 'bg-cyan-500',
  royalties: 'bg-sky-500',
  materials: 'bg-red-500',
  studio: 'bg-orange-500',
  marketing: 'bg-amber-500',
  shipping: 'bg-yellow-500',
  taxes: 'bg-rose-500',
  services: 'bg-pink-500',
  equipment: 'bg-purple-500',
  travel: 'bg-violet-500',
  other: 'bg-gray-500'
};

const FinanceSummary = ({ summary, categoryBreakdown }) => {
  const formatCurrency = (amount, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  // Extraer datos del resumen (estructura: { current: { income, expense, ... }, ... })
  const currentData = summary?.current || {};
  const totalIncome = currentData.income || 0;
  const totalExpenses = currentData.expense || 0;
  const incomeCount = currentData.incomeCount || 0;
  const expenseCount = currentData.expenseCount || 0;

  const balance = totalIncome - totalExpenses;
  const isPositive = balance >= 0;

  // Calculate percentages for categories
  // El breakdown viene como array con { _id: { category, type }, total, count }
  const allCategories = Array.isArray(categoryBreakdown) ? categoryBreakdown : [];
  const incomeCategories = allCategories.filter(c => c._id?.type === 'income').map(c => ({
    _id: c._id?.category,
    total: c.total,
    count: c.count
  }));
  const expenseCategories = allCategories.filter(c => c._id?.type === 'expense').map(c => ({
    _id: c._id?.category,
    total: c.total,
    count: c.count
  }));

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-soft p-4"
        >
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <ArrowUpCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Ingresos</span>
          </div>
          <p className="text-2xl font-bold text-gallery-900">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-xs text-gallery-500 mt-1">
            {incomeCount} transacciones
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-soft p-4"
        >
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <ArrowDownCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Gastos</span>
          </div>
          <p className="text-2xl font-bold text-gallery-900">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-xs text-gallery-500 mt-1">
            {expenseCount} transacciones
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-lg shadow-soft p-4 ${
            isPositive ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className={`flex items-center gap-2 mb-2 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium">Balance</span>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 ml-auto" />
            ) : (
              <TrendingDown className="h-4 w-4 ml-auto" />
            )}
          </div>
          <p className={`text-2xl font-bold ${
            isPositive ? 'text-green-700' : 'text-red-700'
          }`}>
            {isPositive ? '+' : ''}{formatCurrency(balance)}
          </p>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      {(incomeCategories.length > 0 || expenseCategories.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Categories */}
          {incomeCategories.length > 0 && (
            <div className="bg-white rounded-lg shadow-soft p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-gallery-900">Ingresos por categoría</h4>
              </div>
              <div className="space-y-3">
                {incomeCategories.map((cat, index) => {
                  const percentage = totalIncome > 0 ? (cat.total / totalIncome) * 100 : 0;
                  return (
                    <div key={cat._id || index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gallery-600">
                          {categoryLabels[cat._id] || cat._id}
                        </span>
                        <span className="font-medium text-gallery-900">
                          {formatCurrency(cat.total)}
                        </span>
                      </div>
                      <div className="h-2 bg-gallery-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full ${categoryColors[cat._id] || 'bg-green-500'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expense Categories */}
          {expenseCategories.length > 0 && (
            <div className="bg-white rounded-lg shadow-soft p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-gallery-900">Gastos por categoría</h4>
              </div>
              <div className="space-y-3">
                {expenseCategories.map((cat, index) => {
                  const percentage = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
                  return (
                    <div key={cat._id || index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gallery-600">
                          {categoryLabels[cat._id] || cat._id}
                        </span>
                        <span className="font-medium text-gallery-900">
                          {formatCurrency(cat.total)}
                        </span>
                      </div>
                      <div className="h-2 bg-gallery-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full ${categoryColors[cat._id] || 'bg-red-500'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinanceSummary;
