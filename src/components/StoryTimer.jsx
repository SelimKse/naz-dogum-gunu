import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const StoryTimer = ({ duration, currentStep, totalSteps, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    if (!isActive) return;

    setTimeLeft(duration / 1000);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, isActive, currentStep]);

  const progress = ((duration / 1000 - timeLeft) / (duration / 1000)) * 100;

  if (!isActive) return null;

  return (
    <div className="bg-black/70 backdrop-blur-md rounded-full pl-4 pr-5 py-3 border border-blue-500/30 shadow-xl shadow-blue-500/20">
        <div className="flex items-center gap-2">
          {/* Progress Circle */}
          <div className="relative w-11 h-11">
            <svg className="w-11 h-11 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
                className="transition-all duration-500"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            {/* Countdown Number in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-white font-bold text-base tabular-nums"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
                key={timeLeft}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {timeLeft}
              </motion.span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex flex-col items-center">
            <span className="text-blue-400 text-xs font-bold leading-tight">
              {currentStep + 1}/{totalSteps}
            </span>
            <span className="text-gray-500 text-[9px] leading-tight">ADIM</span>
          </div>
        </div>
    </div>
  );
};

StoryTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default StoryTimer;

