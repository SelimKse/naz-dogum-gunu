import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import StoryTimer from "../components/StoryTimer";

const Hayaller = ({ onUpdateTimer }) => {
  const [currentDream, setCurrentDream] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const navigate = useNavigate();

  const dreams = useMemo(() => [
    {
      id: 0,
      title: "Büyük Hayaller",
      content: "Naz'ın hayalleri gökyüzü kadar geniş, deniz kadar derin. Her hayali gerçek olacak. Stitch'in Hawaii'deki gibi, onun da hayalleri sonsuz okyanuslar kadar geniş. Lilo'nun Stitch'e olan inancı gibi, biz de Naz'ın tüm hayallerinin gerçek olacağına inanıyoruz. Her hayali, her umudu, her düşü gerçek olacak.",
      emoji: "🌟"
    },
    {
      id: 1,
      title: "Gelecek Planları",
      content: "Başarılı, mutlu ve sevgi dolu bir gelecek onu bekliyor. Her adımda yanındayız. Stitch'in Lilo ile birlikte yaşadığı gibi, Naz da ailesiyle birlikte güzel bir gelecek yaşayacak. Ohana'nın gücüyle, sevgiyle, mutlulukla dolu bir hayat onu bekliyor.",
      emoji: "🚀"
    },
    {
      id: 2,
      title: "Mutluluk",
      content: "En büyük hayali mutlu olmak. Ve bu hayal zaten gerçek! Stitch'in Lilo'yu mutlu etmek için yaptığı her şey gibi, biz de Naz'ın mutluluğu için her şeyi yapıyoruz. Onun gülümsemesi, bizim en büyük mutluluğumuz. Stitch'in dediği gibi: 'Mutluluk paylaştıkça çoğalır.'",
      emoji: "😊"
    }
  ], []);

  useEffect(() => {
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
    }
  }, [isAutoPlaying]);

  // Timer'ı güncelle
  useEffect(() => {
    if (isAutoPlaying) {
      onUpdateTimer(
        <StoryTimer
          duration={8000}
          currentStep={currentDream}
          totalSteps={dreams.length}
          isActive={true}
        />
      );
    } else {
      onUpdateTimer(null);
    }
  }, [currentDream, isAutoPlaying, dreams.length, onUpdateTimer]);

  // Otomatik hayal geçişi - son adımda da tam süre bekle
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentDream < dreams.length - 1) {
        setCurrentDream(prev => prev + 1);
      } else {
        // Son hayal de bitti, sürprize geç
        navigate('/surpriz');
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentDream, isAutoPlaying, dreams.length, navigate]);

  const currentDreamData = dreams[currentDream];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Arka Plan Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
      
      {/* Subtle Particles */}
      <div className="absolute inset-0">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ana İçerik */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-3 mb-12">
            {dreams.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentDream ? 'bg-purple-400' : 'bg-gray-600'
                }`}
                animate={{
                  scale: index === currentDream ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: index === currentDream ? Infinity : 0,
                }}
              />
            ))}
          </div>

          {/* Dream Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDream}
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              {/* Emoji */}
              <motion.div
                className="text-8xl mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {currentDreamData.emoji}
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-8"
                style={{ fontFamily: 'Fredoka, cursive' }}
                animate={{
                  textShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.5)",
                    "0 0 40px rgba(59, 130, 246, 0.8)",
                    "0 0 20px rgba(147, 51, 234, 0.5)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {currentDreamData.title}
                </span>
              </motion.h1>

              {/* Content */}
              <motion.p
                className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Comfortaa, cursive' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentDreamData.content}
              </motion.p>

              {/* Loading State */}
              {isAutoPlaying && currentDream === dreams.length - 1 && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="text-gray-400" style={{ fontFamily: 'Comfortaa, cursive' }}>
                    Sürprize geçiliyor...
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

Hayaller.propTypes = {
  onUpdateTimer: PropTypes.func,
};

export default Hayaller;