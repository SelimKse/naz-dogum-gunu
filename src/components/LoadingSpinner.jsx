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
    xlarge: 'w-20 h-20'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Animasyonlu arka plan */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
              `,
              backgroundSize: "200% 200%",
            }}
          />
        </div>

        {/* Işık efektleri */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Ana içerik */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Modern spinner container */}
          <div className="relative inline-block mb-8">
            {/* Dış halka */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Ana spinner */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-full border border-purple-500/50 shadow-2xl shadow-purple-500/20">
              {spinner}
            </div>
          </div>

          {/* Loading ikonu */}
          <motion.div
            className="text-6xl mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🔐
          </motion.div>

          {/* Mesaj */}
          <motion.p 
            className="text-white text-2xl md:text-3xl font-light mb-2"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {message}
          </motion.p>

          {/* Alt mesaj */}
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Lütfen bekleyin...
          </motion.p>

          {/* Yükleme noktaları */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
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
