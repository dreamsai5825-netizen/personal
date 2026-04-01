import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessContextType {
  showSuccess: (title: string, message: string, actionLabel?: string, actionPath?: string) => void;
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export const useSuccess = () => {
  const context = useContext(SuccessContext);
  if (!context) {
    throw new Error('useSuccess must be used within a SuccessProvider');
  }
  return context;
};

export const SuccessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({ title: '', message: '', actionLabel: '', actionPath: '' });
  const navigate = useNavigate();

  const showSuccess = (title: string, message: string, actionLabel: string = 'View Orders', actionPath: string = '/orders') => {
    setData({ title, message, actionLabel, actionPath });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleAction = () => {
    close();
    navigate(data.actionPath);
  };

  return (
    <SuccessContext.Provider value={{ showSuccess }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={close}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 sm:p-10 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-3"
                >
                  {data.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 mb-10 leading-relaxed"
                >
                  {data.message}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleAction}
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                  >
                    {data.actionLabel}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={close}
                    className="w-full py-4 text-gray-500 font-semibold hover:text-gray-700 transition-all"
                  >
                    Back to Home
                  </button>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-50 rounded-full opacity-50" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-50 rounded-full opacity-50" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SuccessContext.Provider>
  );
};
