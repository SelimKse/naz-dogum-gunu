import React from "react";
import { motion } from "framer-motion";
import { useTimeline } from "../hooks/useTimeline";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Timeline = () => {
  const { timelineEvents, isLoading, error } = useTimeline();

  if (isLoading) {
    return (
      <LoadingSpinner 
        size="xlarge" 
        message="Timeline yükleniyor..." 
        color="purple"
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <ErrorMessage 
          error={error}
          title="Timeline yüklenirken hata oluştu"
          size="large"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-4 font-quicksand"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="gradient-text">Naz'ın Hikayesi</span>
          <span className="inline-block"> 📖</span>
        </motion.h1>

        <motion.p
          className="text-xl text-purple-300 text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Seninle yaşadığımız özel anlar ✨
        </motion.p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 to-pink-500 h-full"></div>

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                className={`flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                  <div className="card">
                    <div className="text-lg font-semibold text-purple-400 mb-2">
                      {event.date}
                    </div>
                    <h3 className="text-2xl font-bold gradient-text mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-200 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <motion.div
                  className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-gray-900 shadow-lg shadow-purple-500/50 z-10"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />

                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
