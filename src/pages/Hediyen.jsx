import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import StoryTimer from "../components/StoryTimer";

const Hediyen = ({ onUpdateTimer }) => {
  const [currentGift, setCurrentGift] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFinalPage, setShowFinalPage] = useState(false);

  const gifts = useMemo(() => [
    {
      id: 0,
      title: "Kalbimin Hediyesi",
      content: "Bu gün sadece bir doğum günü değil, senin varlığını kutladığımız en özel gün... Sana verebileceğim en değerli hediye, kalbimin en derin köşelerinde sakladığım sonsuz sevgim. Her anımızı, her gülüşümüzü, her bakışımızı bu hikayede topladım. Çünkü sen, hayatımın en güzel hediyesisin.",
      emoji: "💝"
    },
    {
      id: 1,
      title: "Sonsuz Sevgimle",
      content: "Gözlerinin parıltısı, gülüşünün büyüsü, varlığının huzuru... Hepsi benim için bir mucize. Her sabah seni düşünerek uyanmak, her gece seninle uyumak... İşte hayalim bu. Seni seviyorum, dünyadaki tüm kelimeler yetmez anlatmaya. Sen benim her şeyimsin, canım benim.",
      emoji: "💖"
    },
    {
      id: 2,
      title: "Doğum Günün Kutlu Olsun Aşkım",
      content: "Yeni yaşın, hayallerinin en güzellerinin gerçek olduğu, mutluluğun her anını dolu dolu yaşadığın bir yıl olsun. Seni çok ama çok seviyorum canım. Her anında, her adımında yanındayım. İyi ki doğdun, iyi ki varsın, iyi ki benimsin... Tüm kalbimle, sonsuz sevgimle!",
      emoji: "🎂"
    }
  ], []);

  // PDF URL'ini al
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await fetch("/api/list-assets");
        if (response.ok) {
          const data = await response.json();
          const url = data.assets["nazin-kitabi.pdf"];
          if (url) {
            setPdfUrl(url);
          } else {
            setPdfUrl("/assets/documents/nazin-kitabi.pdf");
          }
        }
      } catch (error) {
        console.error("PDF yüklenemedi:", error);
        setPdfUrl("/assets/documents/nazin-kitabi.pdf");
      }
    };

    fetchPdfUrl();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
    }
  }, [isAutoPlaying]);

  // Timer'ı güncelle
  useEffect(() => {
    if (isAutoPlaying && !showFinalPage) {
      onUpdateTimer(
        <StoryTimer
          duration={8000}
          currentStep={currentGift}
          totalSteps={gifts.length}
          isActive={true}
        />
      );
    } else {
      onUpdateTimer(null);
    }
  }, [currentGift, isAutoPlaying, gifts.length, showFinalPage, onUpdateTimer]);

  // Otomatik hediye geçişi
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentGift < gifts.length - 1) {
        setCurrentGift(prev => prev + 1);
      } else {
        // Son hediye bitti, final sayfayı göster
        setShowFinalPage(true);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentGift, isAutoPlaying, gifts.length]);

  // PDF İndir
  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'Nazin-Kitabi.pdf';
      link.click();
    }
  };

  const currentGiftData = gifts[currentGift];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Arka Plan Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
      
      {/* Subtle Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ana İçerik */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!showFinalPage ? (
              // Normal Hediye Sayfaları
              <motion.div
                key={currentGift}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
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
                  {currentGiftData.emoji}
                </motion.div>

                {/* Title */}
                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
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
                    {currentGiftData.title}
                  </span>
                </motion.h1>

                {/* Content */}
                <motion.p
                  className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                  style={{ fontFamily: "Comfortaa, cursive" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentGiftData.content}
                </motion.p>

                {/* Progress Dots */}
                <div className="flex justify-center space-x-3">
                  {gifts.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index <= currentGift ? "bg-purple-400" : "bg-gray-600"
                      }`}
                      animate={{
                        scale: index === currentGift ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 1,
                        repeat: index === currentGift ? Infinity : 0,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              // Final Sayfa - PDF İndirme
              <motion.div
                key="final"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                {/* Kitap Emoji */}
                <motion.div
                  className="text-9xl mb-8"
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  📖
                </motion.div>

                {/* Başlık */}
                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Naz'ın Kitabı
                  </span>
                </motion.h1>

                {/* Alt Başlık */}
                <motion.p
                  className="text-2xl md:text-3xl text-pink-200 mb-12 max-w-5xl mx-auto font-light"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Sadece senin için, kalbimden çıkan kelimelerle yazdığım kitabı indir ve oku! 💖
                </motion.p>

                {/* PDF İndirme Butonu */}
                <motion.button
                  onClick={handleDownloadPdf}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-purple-500/50 mb-8"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    boxShadow: [
                      "0 0 30px rgba(147, 51, 234, 0.5)",
                      "0 0 50px rgba(236, 72, 153, 0.8)",
                      "0 0 30px rgba(147, 51, 234, 0.5)",
                    ],
                  }}
                  transition={{
                    y: { delay: 0.7 },
                    opacity: { delay: 0.7 },
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  📥 Kitabı İndir
                </motion.button>

                {/* Açıklama */}
                <motion.div
                  className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 max-w-6xl mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Bu kitap, kalbimin derinliklerinde sakladığım en güzel duyguları, seninle yaşadığım her anı, her gülüşü, her bakışı içeriyor. Her sayfasında sana olan sevgim var.
                  </p>
                  <p className="text-pink-300 text-xl md:text-2xl font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "Hayatımın en güzel hikayesinin baş kahramanı sensin..." 💖
                  </p>
                </motion.div>

                {/* Dekoratif Kalpler */}
                <div className="mt-12 flex justify-center gap-4 text-4xl">
                  {["💜", "💙", "💖", "💛"].map((heart, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      {heart}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

Hediyen.propTypes = {
  onUpdateTimer: PropTypes.func,
};

export default Hediyen;
