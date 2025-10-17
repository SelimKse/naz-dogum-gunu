import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { loadingSpinnerPropTypes } from '../utils/propTypes';

const LoadingSpinner = ({ 
  size = 'large', 
  message = 'Yükleniyor...', 
  color = 'purple',
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    pink: 'border-pink-500',
    cyan: 'border-cyan-500',
    green: 'border-green-500',
    red: 'border-red-500'
  };

  const textColorClasses = {
    purple: 'text-purple-300',
    blue: 'text-blue-300',
    pink: 'text-pink-300',
    cyan: 'text-cyan-300',
    green: 'text-green-300',
    red: 'text-red-300'
  };

  const spinner = (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-gray-700 border-t-4 ${colorClasses[color]} rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {spinner}
          <p className={`mt-4 text-lg ${textColorClasses[color]}`}>
            {message}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {spinner}
      {message && (
        <p className={`mt-2 text-sm ${textColorClasses[color]}`}>
          {message}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = loadingSpinnerPropTypes;

export default LoadingSpinner;
