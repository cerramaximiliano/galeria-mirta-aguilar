import { motion } from 'framer-motion';
import { TrendingUp, Award } from 'lucide-react';

const SoldCounter = ({ soldCount, totalCount }) => {
  const percentage = Math.round((soldCount / totalCount) * 100);
  
  if (soldCount === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-md">
            <Award className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              ¡Las obras de Mirta están siendo muy solicitadas!
            </h3>
            <p className="text-sm text-gray-600">
              Ya se han vendido <span className="font-bold text-red-600">{soldCount} obras</span> de esta colección
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-black text-red-600">{percentage}%</p>
            <p className="text-xs text-gray-600">vendido</p>
          </div>
          <TrendingUp className="h-8 w-8 text-red-600" />
        </div>
      </div>
      
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        ¡No te quedes sin la tuya! Las obras únicas no se repiten.
      </p>
    </motion.div>
  );
};

export default SoldCounter;