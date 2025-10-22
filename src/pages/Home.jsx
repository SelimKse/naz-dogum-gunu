import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import TopNavigation from "../components/TopNavigation";
import StoryTimer from "../components/StoryTimer";

const Home = ({ onStartMusic, onUpdateTimer }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const storySteps = useMemo(() => [
    {
      id: 0,
      title: "İyi ki Doğdun Canım Benim!",
      subtitle: "Bugün senin için özel bir gün",
      description:
        "Kalbimin en değerli hazinesi... Bugün doğduğun gün, hayatıma renk katan, her anıma anlam veren sen. Senin varlığın, her gününü aydınlatan bir güneş gibi. Stitch ve Lilo'nun sevgisi gibi saf ve sonsuz... Sen benim Ohana'mın en güzel parçasısın. Seni çok ama çok seviyorum.",
      emoji: "🎂",
      duration: 8000,
    },
    {
      id: 1,
      title: "Senin Hikayen",
      subtitle: "Sadece senin için yazıldı",
      description:
        "Bu hikaye, seninle geçirdiğim her anın, her gülüşünün, her bakışının bir hatırası. Kalbimin derinliklerinde sakladığım en güzel duyguları, sana olan sevgimi kelimelerle anlatma çabam. Hawaii'nin masmavi denizleri kadar derin, yıldızlar kadar sonsuz bir sevgiyle...",
      emoji: "✨",
      duration: 8000,
    },
    {
      id: 2,
      title: "Hazır mısın Aşkım?",
      subtitle: "Sürprizlerle dolu bir yolculuk",
      description:
        "Sana hazırladığım bu büyülü dünyada, kalbimin sesini duyacaksın. Her sayfa senin için özel, her kelime sevgiyle yazılmış. Gözlerinin parıltısı, gülüşünün büyüsü... Hepsi bu hikayede saklı. Haydi, birlikte bu aşk dolu yolculuğa başlayalım!",
      emoji: "🌟",
      duration: 8000,
    },
  ], []);

  // Timer'ı her zaman güncelle
  useEffect(() => {
    if (isAutoPlaying && !showIntro) {
      onUpdateTimer(
        <StoryTimer
          duration={storySteps[currentStep].duration}
          currentStep={currentStep}
          totalSteps={storySteps.length}
          isActive={true}
        />
      );
    } else {
      onUpdateTimer(null);
    }
  }, [currentStep, isAutoPlaying, showIntro, storySteps, onUpdateTimer]);

  // Otomatik geçiş - son adımda da tam süre bekle
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < storySteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Son adım da bitti, timeline'a geç
        navigate("/timeline");
      }
    }, storySteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, storySteps, navigate]);

  const startStory = () => {
    setShowIntro(false);
    setIsAutoPlaying(true);
    setCurrentStep(0);
    // Müziği başlat
    if (onStartMusic) {
      onStartMusic();
    }
  };

  const currentStepData = storySteps[currentStep];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Arka Plan Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>

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
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ana İçerik */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Giriş Sayfası */}
          {showIntro && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
            >
              {/* Başlık */}
              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
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
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Canım Naz'ım
                </span>
                <motion.span
                  className="inline-block ml-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  💖
                </motion.span>
              </motion.h1>

              {/* Açıklama */}
              <motion.div
                className="max-w-5xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  className="text-2xl md:text-3xl text-gray-200 mb-6 leading-relaxed font-light"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Kalbimin en derin köşesinden,
                  <br />
                  <span className="text-pink-400 font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Sana olan sonsuz sevgimle
                  </span>{" "}
                  hazırladığım bu özel hikaye...
                </motion.p>

                <motion.p
                  className="text-xl text-gray-300 leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Her kelimesi kalbimin derinliklerinden, her cümlesi sevgiyle yazılmış...
                  <br />
                  <span className="text-pink-400 font-semibold text-2xl">
                    "Sen benim kalbimin en güzel yerinde yaşıyorsun..."
                  </span>
                </motion.p>
              </motion.div>

              {/* Hikayeyi Başlat Butonu */}
              <motion.button
                onClick={startStory}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-2xl shadow-pink-500/50"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  boxShadow: [
                    "0 0 30px rgba(59, 130, 246, 0.5)",
                    "0 0 50px rgba(147, 51, 234, 0.8)",
                    "0 0 30px rgba(59, 130, 246, 0.5)",
                  ],
                }}
                transition={{
                  opacity: { delay: 1.2 },
                  y: { delay: 1.2 },
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                Hikayeyi Başlat
              </motion.button>
            </motion.div>
          )}

          {/* Hikaye İçeriği - Sadece giriş kapandıktan sonra */}
          {!showIntro && (
            <>
              {/* Progress Dots */}
              <div className="flex justify-center space-x-3 mb-12">
                {storySteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep ? "bg-blue-400" : "bg-gray-600"
                    }`}
                    animate={{
                      scale: index === currentStep ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: index === currentStep ? Infinity : 0,
                    }}
                  />
                ))}
              </div>

              {/* Story Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
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
                    {currentStepData.emoji}
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
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
                      {currentStepData.title}
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    className="text-xl md:text-2xl text-pink-300 mb-8 font-medium"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentStepData.subtitle}
                  </motion.p>

                  {/* Description */}
                  <motion.p
                    className="text-lg text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {currentStepData.description}
                  </motion.p>

                  {/* Start Button */}
                  {currentStep === 0 && !isAutoPlaying && (
                    <motion.button
                      onClick={startStory}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl shadow-blue-500/50"
                      style={{ fontFamily: "Fredoka, cursive" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 0 30px rgba(59, 130, 246, 0.5)",
                          "0 0 50px rgba(147, 51, 234, 0.8)",
                          "0 0 30px rgba(59, 130, 246, 0.5)",
                        ],
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      Hikayeyi Başlat
                    </motion.button>
                  )}

                  {/* Loading State */}
                  {isAutoPlaying && currentStep === storySteps.length - 1 && (
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
                      <p
                        className="text-gray-400"
                        style={{ fontFamily: "Comfortaa, cursive" }}
                      >
                        Hikayeye geçiliyor...
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  onStartMusic: PropTypes.func,
  onUpdateTimer: PropTypes.func,
};

export default Home;
