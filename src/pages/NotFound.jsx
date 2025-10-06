import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Animasyonu */}
        <motion.div
          className="text-9xl font-bold mb-6"
          animate={{
            textShadow: [
              "0 0 20px rgba(168, 85, 247, 0.5)",
              "0 0 40px rgba(236, 72, 153, 0.5)",
              "0 0 20px rgba(168, 85, 247, 0.5)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            404
          </span>
        </motion.div>

        {/* Üzgün Emoji */}
        <motion.div
          className="text-8xl mb-8"
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          😢
        </motion.div>

        {/* Başlık */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-purple-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Sayfa Bulunamadı
        </motion.h1>

        {/* Açıklama */}
        <motion.p
          className="text-xl text-gray-400 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. 🔍
        </motion.p>

        {/* Butonlar */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🏠</span>
            <span>Ana Sayfaya Dön</span>
          </motion.button>

          <motion.button
            onClick={() => navigate(-1)}
            className="bg-gray-700 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>←</span>
            <span>Geri Git</span>
          </motion.button>
        </motion.div>

        {/* Dekoratif Yıldızlar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-purple-400/30 text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
