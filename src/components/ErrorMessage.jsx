import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { errorMessagePropTypes } from '../utils/propTypes';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  title = 'Bir hata oluştu',
  showDetails = false,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const iconSizes = {
    small: 'text-3xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <motion.div
      className={`bg-red-900/20 border-2 border-red-500/30 rounded-xl ${sizeClasses[size]} text-center`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`${iconSizes[size]} mb-4`}
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ❌
      </motion.div>
      
      <h3 className="text-lg font-bold text-red-400 mb-2">
        {title}
      </h3>
      
      <p className="text-red-300 mb-4">
        {error?.message || error || 'Beklenmeyen bir hata oluştu'}
      </p>

      {showDetails && error?.stack && (
        <details className="mb-4 text-left">
          <summary className="text-sm text-red-400 cursor-pointer hover:text-red-300">
            Hata Detayları
          </summary>
          <div className="mt-2 p-3 bg-red-900/30 rounded text-xs text-red-200 overflow-auto max-h-32">
            <pre>{error.stack}</pre>
          </div>
        </details>
      )}

      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Tekrar Dene
        </motion.button>
      )}
    </motion.div>
  );
};

ErrorMessage.propTypes = errorMessagePropTypes;

export default ErrorMessage;
