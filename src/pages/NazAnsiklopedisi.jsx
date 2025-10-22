import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import StoryTimer from "../components/StoryTimer";

const NazAnsiklopedisi = ({ onUpdateTimer }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const navigate = useNavigate();

  const encyclopediaPages = useMemo(() => [
    {
      id: 0,
      title: "Naz Hakkında",
      content: "Naz, hayatımızın en güzel hediyesi. Onun gülümsemesi dünyayı aydınlatır, sevgisi kalbimizi ısıtır. Stitch'in Lilo'ya olan sevgisi gibi, Naz'ın sevgisi de saf ve koşulsuz. Onun varlığı, Hawaii'nin güneşi gibi hayatımızı aydınlatıyor. Her gülümsemesi, her kahkahası, her anı bizim için bir hazine.",
      emoji: "👑"
    },
    {
      id: 1,
      title: "En Sevdiği Renkler",
      content: "Mavi ve mor - gökyüzü kadar sonsuz, çiçekler kadar güzel. Bu renkler onun kişiliğini yansıtır. Mavi, Stitch'in gözlerinin rengi gibi derin ve büyülü. Mor ise Hawaii'nin gün batımı gibi romantik ve sıcak. Bu renkler onun ruhunu, hayallerini ve sevgisini temsil ediyor.",
      emoji: "💙"
    },
    {
      id: 2,
      title: "Stitch Aşkı",
      content: "Stitch ile olan bağı sadece bir çizgi film değil, dostluk ve aile sevgisinin simgesi. Stitch'in 'Ohana demek aile demek' sözü, Naz'ın da hayat felsefesi. Onun Stitch'e olan sevgisi, saf dostluğun ve koşulsuz sevginin en güzel örneği. Stitch gibi o da ailesini her şeyden çok seviyor.",
      emoji: "💙"
    },
    {
      id: 3,
      title: "Özel Günler",
      content: "Her gün onun için özel, ama bugün daha da özel. Doğum günü kutlu olsun! Stitch'in doğum gününde Lilo'nun ona verdiği sevgi gibi, biz de Naz'a tüm sevgimizi veriyoruz. Bu özel gün, sadece bir yaş daha büyümek değil, aynı zamanda daha da güzel anılar biriktirmek demek.",
      emoji: "🎂"
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
          currentStep={currentPage}
          totalSteps={encyclopediaPages.length}
          isActive={true}
        />
      );
    } else {
      onUpdateTimer(null);
    }
  }, [currentPage, isAutoPlaying, encyclopediaPages.length, onUpdateTimer]);

  // Otomatik sayfa geçişi - son adımda da tam süre bekle
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentPage < encyclopediaPages.length - 1) {
        setCurrentPage(prev => prev + 1);
      } else {
        // Son sayfa da bitti, hayallere geç
        navigate('/hayaller');
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentPage, isAutoPlaying, encyclopediaPages.length, navigate]);

  const currentPageData = encyclopediaPages[currentPage];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Arka Plan Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
      
      {/* Subtle Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
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
            {encyclopediaPages.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentPage ? 'bg-blue-400' : 'bg-gray-600'
                }`}
                animate={{
                  scale: index === currentPage ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: index === currentPage ? Infinity : 0,
                }}
              />
            ))}
          </div>

          {/* Page Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              {/* Emoji veya Stitch Resmi */}
              <motion.div
                className="text-8xl mb-8 flex justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {currentPage === 2 ? (
                  <motion.img
                    src="/assets/images/icons/stitch.png"
                    alt="Stitch"
                    className="w-20 h-20 object-contain"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                ) : (
                  currentPageData.emoji
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-8"
                style={{ fontFamily: 'Fredoka, cursive' }}
                animate={{
                  textShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(147, 51, 234, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {currentPageData.title}
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
                {currentPageData.content}
              </motion.p>

              {/* Loading State */}
              {isAutoPlaying && currentPage === encyclopediaPages.length - 1 && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="text-gray-400" style={{ fontFamily: 'Comfortaa, cursive' }}>
                    Hayallere geçiliyor...
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

NazAnsiklopedisi.propTypes = {
  onUpdateTimer: PropTypes.func,
};

export default NazAnsiklopedisi;