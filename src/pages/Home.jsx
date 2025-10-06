import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Konfeti parçacıkları oluştur - Kelebek emojileri
    const confettiPieces = Array(50)
      .fill()
      .map((_, i) => ({
        id: i,
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 1200),
        delay: Math.random() * 3,
        emoji: ["🦋"][Math.floor(Math.random() * 3)],
      }));
    setConfetti(confettiPieces);
  }, []);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Konfeti Animasyonu - Global */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute text-lg filter-none"
            style={{
              left: piece.x,
            }}
            initial={{ y: -10, opacity: 0, rotate: 0 }}
            animate={{
              y: typeof window !== "undefined" ? window.innerHeight + 100 : 800,
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360],
              x: [0, 20, -20, 0],
            }}
            transition={{
              duration: 4,
              delay: piece.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 3 + 2,
              ease: "easeInOut",
            }}
          >
            {piece.emoji}
          </motion.div>
        ))}
      </div>

      {/* İlk Section - Ana İçerik ve İconlar */}
      <section className="h-screen flex items-center justify-center snap-start relative">
        <div className="container mx-auto px-4 text-center z-10 flex flex-col justify-center min-h-screen">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold inline-block font-quicksand leading-tight py-4"
              animate={{
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="gradient-text">İyi ki Doğdun Naz</span>
              <span className="inline-block">🎂</span>
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl text-purple-300 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Bu özel gün senin günün! ✨
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="card max-w-md">
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/assets/images/icons/stitch.png"
                  alt="Stitch"
                  className="w-32 h-32 object-contain mx-auto"
                />
              </motion.div>

              <p className="text-xl text-purple-300 font-medium">
                "Ohana means family!" 💙
              </p>
            </div>
          </motion.div>

          <motion.div
            className="mt-16 flex justify-center space-x-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.span
              className="text-4xl filter-none"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎈
            </motion.span>
            <motion.span
              className="text-4xl filter-none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🍰
            </motion.span>
            <motion.span
              className="text-4xl filter-none"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎁
            </motion.span>
            <motion.span
              className="text-4xl filter-none"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⭐
            </motion.span>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            <p className="text-xl md:text-2xl text-purple-300 font-medium max-w-2xl mx-auto">
              Mavi gökyüzü kadar sonsuz, mor çiçekler kadar güzel bir doğum günü
              geçir! 💜💙
            </p>
          </motion.div>
        </div>
      </section>

      {/* İkinci Section - Fotoğraf Galerisi */}
      <section className="h-screen flex items-center justify-center snap-start relative">
        <div className="container mx-auto px-4 text-center z-10">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-purple-300 mb-8">
              🎉 Özel Anılar 🎉
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:shadow-xl transition-shadow border border-purple-500/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-950 rounded-xl h-64 mb-4 overflow-hidden">
                  <img
                    src="/assets/images/photos/photo1.jpg"
                    alt="Güzel Anılar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-full h-full flex items-center justify-center border-2 border-dashed border-purple-500/30"
                    style={{ display: "none" }}
                  >
                    <div className="text-center">
                      <span className="text-4xl filter-none mb-2 block">
                        📸
                      </span>
                      <p className="text-purple-400 text-sm">
                        Fotoğraf eklenecek
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-purple-300 font-medium">
                  Güzel Anılar
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:shadow-xl transition-shadow border border-pink-500/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-950 rounded-xl h-64 mb-4 overflow-hidden">
                  <img
                    src="/assets/images/photos/photo2.jpg"
                    alt="Doğum Günü Kutlaması"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-pink-500/30" style={{ display: "none" }}>
                    <div className="text-center">
                      <span className="text-4xl filter-none mb-2 block">
                        🎂
                      </span>
                      <p className="text-pink-400 text-sm">
                        Doğum günü fotoğrafları
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-purple-300 font-medium">
                  Doğum Günü Kutlaması
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:shadow-xl transition-shadow border border-purple-500/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-950 rounded-xl h-64 mb-4 overflow-hidden">
                  <img
                    src="/assets/images/photos/photo3.jpg"
                    alt="Özel Günler"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-purple-500/30" style={{ display: "none" }}>
                    <div className="text-center">
                      <span className="text-4xl filter-none mb-2 block">
                        🌟
                      </span>
                      <p className="text-purple-400 text-sm">
                        Özel günlerin fotoğrafları
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-purple-300 font-medium">
                  Özel Günler
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Stitch Karakter Bölümü */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="text-center p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-500/20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-24 w-24 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/images/icons/stitch.png"
                  alt="Stitch"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "block";
                  }}
                />
              </div>
              <p className="text-sm text-purple-300 font-medium">Stitch</p>
            </motion.div>
            <motion.div
              className="text-center p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-500/20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-24 w-24 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/images/icons/lilo.png"
                  alt="Lilo"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "block";
                  }}
                />
              </div>
              <p className="text-sm text-purple-300 font-medium">Lilo</p>
            </motion.div>
            <motion.div
              className="text-center p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-500/20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-24 w-24 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/images/icons/hawaii.png"
                  alt="Hawaii"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "block";
                  }}
                />
              </div>
              <p className="text-sm text-purple-300 font-medium">Hawaii</p>
            </motion.div>
            <motion.div
              className="text-center p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-500/20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-24 w-24 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/images/icons/ohana.png"
                  alt="Ohana"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "block";
                  }}
                />
              </div>
              <p className="text-sm text-purple-300 font-medium">Ohana</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
