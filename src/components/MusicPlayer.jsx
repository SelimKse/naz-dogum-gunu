import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const MusicPlayer = ({ track, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (autoPlay) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
      setIsPlaying(true);
    }
  };

  if (!track) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-8 left-0 right-0 z-50 flex justify-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Dynamic Island Style Music Player */}
        <div className="bg-black/90 backdrop-blur-xl rounded-full px-4 py-3 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
          <div className="flex items-center gap-3 min-w-[260px]">
            {/* Album Art */}
            <motion.div
              className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-500/50"
              animate={{
                rotate: isPlaying ? 360 : 0,
              }}
              transition={{
                duration: 10,
                repeat: isPlaying ? Infinity : 0,
                ease: "linear",
              }}
            >
              {track.image ? (
                <img
                  src={track.image}
                  alt={track.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
              )}
            </motion.div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <motion.p
                className="text-white font-semibold text-sm truncate"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {track.name}
              </motion.p>
              <motion.p
                className="text-gray-400 text-xs truncate"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {track.artist}
              </motion.p>
            </div>

            {/* Play/Pause Button */}
            <motion.button
              onClick={handleTogglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? (
                  // Pause Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  // Play Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-white ml-0.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Audio Element */}
          {track.url && (
            <audio ref={audioRef} src={track.url} loop preload="auto" />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

MusicPlayer.propTypes = {
  track: PropTypes.shape({
    name: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    image: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  autoPlay: PropTypes.bool,
};

export default MusicPlayer;
