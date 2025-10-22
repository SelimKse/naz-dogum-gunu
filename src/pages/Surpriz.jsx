import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Surpriz = ({ onUpdateTimer }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showCinemaIntro, setShowCinemaIntro] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  // Tarih kontrolü
  const currentDate = new Date();
  const targetDate = new Date("2026-04-26");
  const isSpecialDate = currentDate.toDateString() === targetDate.toDateString();
  const videoFilename = isSpecialDate ? "video.mp4" : "intro.mp4";

  // Timer'ı kapat
  useEffect(() => {
    onUpdateTimer(null);
  }, [onUpdateTimer]);

  // Video URL'ini al
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch("/api/list-assets");
        if (response.ok) {
          const data = await response.json();
          const url = data.assets[videoFilename];
          if (url) {
            setVideoUrl(url);
          } else {
            setVideoUrl(`/assets/videos/${videoFilename}`);
          }
        }
      } catch (error) {
        console.error("Video yüklenemedi:", error);
        setVideoUrl(`/assets/videos/${videoFilename}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoUrl();
  }, [videoFilename]);

  // Sinema intro countdown
  useEffect(() => {
    if (showCinemaIntro && !isLoading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowCinemaIntro(false);
            setVideoStarted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showCinemaIntro, isLoading]);

  // Video oynat
  useEffect(() => {
    if (videoStarted && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video oynatılamadı:", error);
      });
    }
  }, [videoStarted]);

  // Video bitince
  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => {
      navigate("/hediyen");
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white text-xl">Film yükleniyor...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Sinema Perdesi - Açılma Animasyonu */}
      <AnimatePresence>
        {showCinemaIntro && (
          <>
            {/* Sol Perde */}
            <motion.div
              className="fixed top-0 left-0 h-full w-1/2 bg-gradient-to-r from-red-900 via-red-800 to-red-700 z-50"
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
              {/* Perde detayları */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-1 bg-black/20"
                    style={{ top: `${i * 5}%` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Sağ Perde */}
            <motion.div
              className="fixed top-0 right-0 h-full w-1/2 bg-gradient-to-l from-red-900 via-red-800 to-red-700 z-50"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
              {/* Perde detayları */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-1 bg-black/20"
                    style={{ top: `${i * 5}%` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Countdown Overlay */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-white text-9xl font-bold mb-8"
                  key={countdown}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    textShadow: "0 0 40px rgba(147, 51, 234, 0.8), 0 0 80px rgba(59, 130, 246, 0.6)",
                  }}
                >
                  {countdown}
                </motion.div>
                <motion.p
                  className="text-white text-2xl font-light"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  Film başlıyor...
                </motion.p>
              </div>
            </motion.div>

            {/* Film Işığı Efekti */}
            <motion.div
              className="fixed top-0 left-1/2 -translate-x-1/2 w-64 h-full z-[55]"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 50%)",
                filter: "blur(40px)",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Video Player - Sinema Modu */}
      <AnimatePresence>
        {videoStarted && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Sinema Çerçevesi - Üst ve Alt Siyah Barlar */}
            <div className="absolute inset-x-0 top-0 h-16 bg-black z-50" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-black z-50" />

            {/* Video Container */}
            <div className="w-full h-full flex items-center justify-center bg-black">
              {videoUrl && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  onEnded={handleVideoEnd}
                  playsInline
                >
                  <source src={videoUrl} type="video/mp4" />
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              )}
            </div>

            {/* Video Kontrolleri - Alt Sağ */}
            <motion.div
              className="absolute bottom-24 right-8 z-50 flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {/* Play/Pause */}
              <motion.button
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.paused) {
                      videoRef.current.play();
                    } else {
                      videoRef.current.pause();
                    }
                  }
                }}
                className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.button>

              {/* Fullscreen */}
              <motion.button
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }
                }}
                className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </motion.button>
            </motion.div>

            {/* Film Adı - Alt Sol */}
            <motion.div
              className="absolute bottom-24 left-8 z-50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-purple-500/30">
                <h2 className="text-white text-2xl font-bold mb-1">
                  🎬 Naz'ın Özel Günü
                </h2>
                <p className="text-gray-300 text-sm">
                  Seninle birlikte yaşadığımız en güzel anlar
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Bitti - Credits */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            className="fixed inset-0 bg-black z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="text-8xl mb-8"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🎬
              </motion.div>
              <h1
                className="text-5xl md:text-7xl font-bold mb-6"
                style={{
                  fontFamily: "Fredoka, cursive",
                  background: "linear-gradient(to right, #60a5fa, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Muhteşemdi!
              </h1>
              <p className="text-white text-2xl mb-4">
                Film bitti, ama hikaye devam ediyor...
              </p>
              <motion.div
                className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Surpriz.propTypes = {
  onUpdateTimer: PropTypes.func,
};

export default Surpriz;
