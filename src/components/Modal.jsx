import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, message, type = "info", onConfirm }) => {
  if (!isOpen) return null;

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    question: "❓",
  };

  const colors = {
    success: {
      bg: "from-green-600 to-green-700",
      border: "border-green-500/30",
      button: "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    },
    error: {
      bg: "from-red-600 to-red-700",
      border: "border-red-500/30",
      button: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
    },
    warning: {
      bg: "from-orange-600 to-orange-700",
      border: "border-orange-500/30",
      button: "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
    },
    info: {
      bg: "from-blue-600 to-blue-700",
      border: "border-blue-500/30",
      button: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    },
    question: {
      bg: "from-purple-600 to-purple-700",
      border: "border-purple-500/30",
      button: "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
    },
  };

  const currentColor = colors[type] || colors.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border-2 border-purple-500/30 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${currentColor.bg} p-6`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{icons[type]}</span>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-200 text-lg leading-relaxed">{message}</p>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              {onConfirm ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r ${currentColor.button} text-white rounded-lg transition-colors font-semibold shadow-lg`}
                  >
                    Onayla
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className={`w-full px-6 py-3 bg-gradient-to-r ${currentColor.button} text-white rounded-lg transition-colors font-semibold shadow-lg`}
                >
                  Tamam
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
