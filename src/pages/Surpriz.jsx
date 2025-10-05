import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Surpriz = () => {
  const navigate = useNavigate();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showError, setShowError] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // Environment kontrolü
  const isDevelopment = import.meta.env.VITE_APP_ENV === "development";

  // Tarih kontrolü - 26.04.2026 ise video.mp4, değilse intro.mp4
  const currentDate = new Date();
  const targetDate = new Date("2026-04-26");
  const isSpecialDate =
    currentDate.toDateString() === targetDate.toDateString();
  const videoSrc = isSpecialDate
    ? "/video.mp4"
    : "https://github.com/SelimKse/naz-dogum-gunu/blob/main/src/assets/intro.mp4";

  const handleReveal = () => {
    setIsRevealed(true);
    // Konfeti animasyonunu tetikle
    if (!confettiTriggered) {
      setConfettiTriggered(true);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Sol alttan orta üste kalp konfetileri
  const confettiHeartsLeft = Array(12)
    .fill()
    .map((_, i) => (
      <motion.div
        key={`heart-left-${i}`}
        className="fixed pointer-events-none z-50 text-2xl"
        style={{
          left: Math.random() * 50 + "%", // Sol tarafta çok geniş alan
          bottom: Math.random() * 40 + "%", // Alt tarafta çok geniş alan
        }}
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={
          confettiTriggered
            ? {
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.8],
                x: window.innerWidth * 0.05 + Math.random() * 500, // Merkeze doğru çok geniş
                y: -(window.innerHeight * 0.3 + Math.random() * 500), // Üste doğru çok yüksek
                rotate: Math.random() * 720, // 2 tam tur (optimize)
              }
            : {}
        }
        transition={{
          duration: 2 + Math.random() * 2, // Kısaltılmış süre
          delay: Math.random() * 1, // Azaltılmış gecikme
          ease: "easeOut",
        }}
      >
        💙
      </motion.div>
    ));

  // Sağ alttan orta üste kalp konfetileri
  const confettiHeartsRight = Array(12)
    .fill()
    .map((_, i) => (
      <motion.div
        key={`heart-right-${i}`}
        className="fixed pointer-events-none z-50 text-2xl"
        style={{
          right: Math.random() * 50 + "%", // Sağ tarafta çok geniş alan
          bottom: Math.random() * 40 + "%", // Alt tarafta çok geniş alan
        }}
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={
          confettiTriggered
            ? {
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.8],
                x: -(window.innerWidth * 0.05 + Math.random() * 500), // Merkeze doğru çok geniş
                y: -(window.innerHeight * 0.3 + Math.random() * 500), // Üste doğru çok yüksek
                rotate: Math.random() * 720, // 2 tam tur (optimize)
              }
            : {}
        }
        transition={{
          duration: 2 + Math.random() * 2, // Kısaltılmış süre
          delay: Math.random() * 1, // Azaltılmış gecikme
          ease: "easeOut",
        }}
      >
        💙
      </motion.div>
    ));

  // Sol alttan orta üste kelebek konfetileri
  const confettiButterfliesLeft = Array(8)
    .fill()
    .map((_, i) => (
      <motion.div
        key={`butterfly-left-${i}`}
        className="fixed pointer-events-none z-50 text-xl"
        style={{
          left: Math.random() * 60 + "%", // Sol tarafta ultra geniş alan
          bottom: Math.random() * 45 + "%", // Alt tarafta ultra geniş alan
        }}
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={
          confettiTriggered
            ? {
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0.6],
                x: window.innerWidth * 0.1 + Math.random() * 400, // Optimize edilmiş alan
                y: -(window.innerHeight * 0.3 + Math.random() * 400), // Optimize edilmiş yükseklik
                rotate: [
                  0,
                  180 + Math.random() * 180,
                  360 + Math.random() * 180,
                ], // Basitleştirilmiş dönüş
              }
            : {}
        }
        transition={{
          duration: 2.5 + Math.random() * 1.5, // Kısaltılmış süre
          delay: Math.random() * 1, // Azaltılmış gecikme
          ease: "easeInOut",
        }}
      >
        🦋
      </motion.div>
    ));

  // Sağ alttan orta üste kelebek konfetileri
  const confettiButterfliesRight = Array(8)
    .fill()
    .map((_, i) => (
      <motion.div
        key={`butterfly-right-${i}`}
        className="fixed pointer-events-none z-50 text-xl"
        style={{
          right: Math.random() * 60 + "%", // Sağ tarafta ultra geniş alan
          bottom: Math.random() * 45 + "%", // Alt tarafta ultra geniş alan
        }}
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={
          confettiTriggered
            ? {
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0.6],
                x: -(window.innerWidth * 0.1 + Math.random() * 400), // Optimize edilmiş alan
                y: -(window.innerHeight * 0.3 + Math.random() * 400), // Optimize edilmiş yükseklik
                rotate: [
                  0,
                  -(180 + Math.random() * 180),
                  -(360 + Math.random() * 180),
                ], // Basitleştirilmiş dönüş
              }
            : {}
        }
        transition={{
          duration: 2.5 + Math.random() * 1.5, // Kısaltılmış süre
          delay: Math.random() * 1, // Azaltılmış gecikme
          ease: "easeInOut",
        }}
      >
        🦋
      </motion.div>
    ));

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        isRevealed ? "bg-black p-0" : "py-20 px-4"
      }`}
    >
      <div
        className={`${
          isRevealed
            ? "w-full h-full"
            : "container mx-auto max-w-7xl text-center"
        }`}
      >
        {/* Animasyonlu arka plan parıltıları - Optimize edilmiş */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-naz-purple-400 rounded-full blur-3xl opacity-20 will-change-transform"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-24 h-24 bg-naz-blue-400 rounded-full blur-3xl opacity-20 will-change-transform"
            animate={{
              scale: [1.2, 0.8, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-yellow-400 rounded-full blur-3xl opacity-15 will-change-transform"
            animate={{
              scale: [0.8, 1.3, 0.8],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {!isRevealed && (
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            {/* Göz alıcı başlık - Basitleştirilmiş */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-8 font-quicksand relative"
              animate={{
                textShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                  "0 0 30px rgba(59, 130, 246, 0.7)",
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="gradient-text relative inline-block">
                SÜRPRIZ ZAMANI!
              </span>

              <motion.span
                className="inline-block ml-4 text-7xl md:text-9xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🎁
              </motion.span>
            </motion.h1>

            {/* Basitleştirilmiş alt çizgi efekti */}
            <motion.div
              className="w-96 h-1 mx-auto mb-8 relative overflow-hidden rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #8B5CF6, #3B82F6, #8B5CF6, transparent)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-75"
                animate={{
                  x: [-100, 400],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {!isRevealed ? (
          <motion.div
            className="space-y-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Açıklama Metni */}
            <motion.div
              className="max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.p
                className="text-xl md:text-2xl text-purple-300 font-light leading-relaxed mb-6"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Senin için özenle hazırladığım şeyi görmeye hazır mısın? 🎬
              </motion.p>
              <motion.p
                className="text-lg md:text-xl text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Bu şey, seninle geçirdiğimiz tüm güzel anılarla dolu... 💙
              </motion.p>
            </motion.div>

            <motion.button
              className="btn-primary text-2xl px-12 py-6 relative overflow-hidden"
              onClick={handleReveal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                  "0 0 40px rgba(139, 92, 246, 0.8)",
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity },
              }}
            >
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                🎁 Sürprizi Aç! 🎁
              </motion.span>
            </motion.button>

            <motion.p
              className="text-xl text-purple-300"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Tıkla ve sürprizi keşfet! ✨
            </motion.p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="w-full h-screen flex items-center justify-center absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Video Container - Tam Ekran Temiz */}
              <motion.div
                className="relative w-full h-full bg-black flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  preload="metadata"
                  playsInline
                  loop={isSpecialDate} // Özel günde döngü
                  muted
                  controls={!isFullscreen} // Tam ekranda kontrol gizle
                  onEnded={() => !isSpecialDate && setVideoEnded(true)}
                >
                  <source src={videoSrc} type="video/mp4" />
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </motion.div>

              {/* Geriye Dön Butonu - Sadece Development'ta */}
              {isDevelopment && (
                <motion.button
                  onClick={() => setIsRevealed(false)}
                  className="absolute top-20 left-24 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-semibold z-50 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border-2 border-white/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">←</span>
                  Geri Dön
                </motion.button>
              )}

              {/* İlerle Butonu - Production'da video bitince görünür */}
              {!isDevelopment && videoEnded && (
                <motion.button
                  onClick={() => setShowFeedbackForm(true)}
                  className="absolute bottom-8 left-8 bg-gradient-to-r from-naz-purple-600 to-naz-blue-600 text-white px-6 py-3 rounded-full font-bold z-50 hover:from-naz-purple-700 hover:to-naz-blue-700 transition-all duration-300 flex items-center gap-2 border-2 border-white/30 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.8)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>İlerle</span>
                  <span className="text-xl">→</span>
                </motion.button>
              )}

              {/* Video overlay effects - Video container dışında */}
              <motion.div
                className="absolute top-20 right-24 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                ⚪ {isSpecialDate ? "ÖZEL GÜN" : "NAZ'A ÖZEL"}
              </motion.div>

              <motion.div
                className="absolute top-28 right-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                🎬 {isSpecialDate ? "ÖZEL VIDEO" : "PREMIERE"}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Kalp ve Kelebek Konfeti Patlaması - Sol ve sağ alttan orta üste */}
        {confettiTriggered && (
          <div className="confetti-animation fixed inset-0 pointer-events-none z-40">
            {confettiHeartsLeft}
            {confettiHeartsRight}
            {confettiButterfliesLeft}
            {confettiButterfliesRight}
          </div>
        )}

        {/* Feedback Form Sayfası */}
        <AnimatePresence>
          {showFeedbackForm && (
            <motion.div
              className="fixed inset-0 bg-gradient-to-br from-naz-purple-900 via-naz-blue-900 to-purple-900 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 20 }}
              >
                {/* Başlık */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold text-white mb-3 font-quicksand">
                    Video Nasıldı? 🎬
                  </h2>
                  <p className="text-lg text-white/80">
                    Düşüncelerini benimle paylaş! 💙
                  </p>
                </motion.div>

                {/* Textarea */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Videoyu izlerken neler hissettin? Düşüncelerini buraya yaz... ✨"
                    className="w-full h-48 bg-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-2xl p-6 border-2 border-white/30 focus:border-white/60 focus:outline-none resize-none text-lg transition-all duration-300"
                    style={{ fontFamily: "Quicksand, sans-serif" }}
                  />
                  <div className="text-right mt-2 text-white/60 text-sm">
                    {feedback.length} karakter
                  </div>
                </motion.div>

                {/* Butonlar */}
                <motion.div
                  className="flex gap-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Geri Dön Butonu */}
                  <motion.button
                    onClick={() => setShowFeedbackForm(false)}
                    className="flex-1 bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ← Videoya Dön
                  </motion.button>

                  {/* İlerle Butonu */}
                  <motion.button
                    onClick={async () => {
                      if (feedback.trim().length >= 100) {
                        // Feedback'i dosyaya kaydet
                        try {
                          const response = await fetch(
                            "http://localhost:3001/api/save-feedback",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                feedback: feedback.trim(),
                              }),
                            }
                          );

                          if (response.ok) {
                            console.log("✅ Feedback başarıyla kaydedildi!");
                          } else {
                            console.error("❌ Feedback kaydedilemedi");
                          }
                        } catch (error) {
                          console.error("❌ Server bağlantı hatası:", error);
                        }

                        // Development: Ana sayfaya dön
                        // Production: Hediyen sayfasına git
                        if (isDevelopment) {
                          setShowFeedbackForm(false);
                          setIsRevealed(false);
                          setFeedback("");
                          setShowError(false);
                        } else {
                          navigate("/hediyen");
                        }
                      } else if (feedback.trim().length > 0) {
                        setShowError(true);
                      }
                    }}
                    disabled={feedback.trim().length === 0}
                    className={`flex-1 px-6 py-4 rounded-full font-bold transition-all duration-300 border-2 ${
                      feedback.trim().length > 0
                        ? "bg-gradient-to-r from-naz-purple-600 to-naz-blue-600 text-white border-white/30 hover:from-naz-purple-700 hover:to-naz-blue-700 cursor-pointer"
                        : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                    }`}
                    whileHover={
                      feedback.trim().length > 0 ? { scale: 1.02 } : {}
                    }
                    whileTap={feedback.trim().length > 0 ? { scale: 0.98 } : {}}
                  >
                    {feedback.trim().length > 0
                      ? "İlerle →"
                      : "Önce Düşüncelerini Yaz"}
                  </motion.button>
                </motion.div>

                {/* Uyarı Mesajı */}
                {showError && feedback.trim().length < 100 && (
                  <motion.p
                    className="text-center text-red-400 mt-4 text-sm font-bold"
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    ❌ Bu kadarcık mı? En az 100 karakter yazmalısın!
                  </motion.p>
                )}
                {feedback.trim().length === 0 && (
                  <motion.p
                    className="text-center text-white/60 mt-4 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    💡 İlerlemek için düşüncelerini yazmalısın
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Surpriz;
