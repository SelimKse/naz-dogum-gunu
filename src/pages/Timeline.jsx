import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTimeline } from "../hooks/useTimeline";
import StoryTimer from "../components/StoryTimer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Timeline = ({ onUpdateTimer }) => {
  const { timelineEvents, isLoading, error } = useTimeline();
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const EVENT_DURATION = 5000; // Her event 5 saniye
  const COMPLETE_WAIT = 8000; // Timeline bittikten 8 saniye sonra devam

  // İlk event'i göster
  useEffect(() => {
    if (timelineEvents.length > 0 && visibleEvents.length === 0) {
      setVisibleEvents([timelineEvents[0]]);
      setCurrentIndex(0);
    }
  }, [timelineEvents, visibleEvents.length]);

  // Timer'ı güncelle
  useEffect(() => {
    if (timelineEvents.length === 0) {
      onUpdateTimer(null);
      return;
    }

    if (isComplete) {
      // Timeline tamamlandı, 8 saniye bekleme
      onUpdateTimer(
        <StoryTimer
          duration={COMPLETE_WAIT}
          currentStep={0}
          totalSteps={1}
          isActive={true}
        />
      );
    } else if (visibleEvents.length > 0) {
      // Event gösterme süresi
      onUpdateTimer(
        <StoryTimer
          duration={EVENT_DURATION}
          currentStep={currentIndex}
          totalSteps={timelineEvents.length}
          isActive={true}
        />
      );
    }
  }, [currentIndex, visibleEvents, timelineEvents.length, isComplete, onUpdateTimer]);

  // Otomatik event ekleme
  useEffect(() => {
    if (timelineEvents.length === 0 || isComplete) return;
    if (currentIndex >= timelineEvents.length) return;

    const timer = setTimeout(() => {
      if (currentIndex < timelineEvents.length - 1) {
        // Sonraki event'i ekle
        const nextIndex = currentIndex + 1;
        setVisibleEvents((prev) => [...prev, timelineEvents[nextIndex]]);
        setCurrentIndex(nextIndex);
      } else {
        // Tüm eventler gösterildi
        setIsComplete(true);
      }
    }, EVENT_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, timelineEvents.length, isComplete, timelineEvents]);

  // Timeline tamamlandıktan sonra devam et
  useEffect(() => {
    if (!isComplete) return;

    const timer = setTimeout(() => {
      navigate("/ansiklopedi");
    }, COMPLETE_WAIT);

    return () => clearTimeout(timer);
  }, [isComplete, navigate]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="xlarge"
        message="Hikaye yükleniyor..."
        color="blue"
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <ErrorMessage
          error={error}
          title="Hikaye yüklenirken hata oluştu"
          size="large"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="text-center">
          <p className="text-white text-xl">Henüz timeline olayı eklenmemiş.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Arka Plan Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>

      {/* Subtle Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl w-full">
          {/* Başlık */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-center mb-12"
            style={{ fontFamily: "Fredoka, cursive" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Hikayemiz
            </span>
          </motion.h1>

          {/* Timeline Olayları - Alt Alta */}
          <div className="space-y-6">
            <AnimatePresence>
              {visibleEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 shadow-2xl shadow-blue-500/20"
                >
                  {/* Üst Kısım - Tarih, Icon, Başlık */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* Icon */}
                    <div className="text-4xl">{event.icon || "📅"}</div>

                    {/* Tarih ve Başlık */}
                    <div className="flex-1">
                      <div className="text-blue-300 text-sm font-semibold mb-1">
                        {event.date}
                      </div>
                      <h3 className="text-white text-xl md:text-2xl font-bold">
                        {event.title}
                      </h3>
                    </div>

                    {/* Event Numarası */}
                    <div className="text-gray-400 text-sm">
                      {index + 1}/{timelineEvents.length}
                    </div>
                  </div>

                  {/* Açıklama */}
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Tamamlandı Mesajı */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 text-center"
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
              <p className="text-white text-2xl font-light">
                Hikaye devam ediyor...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

Timeline.propTypes = {
  onUpdateTimer: PropTypes.func,
};

export default Timeline;
