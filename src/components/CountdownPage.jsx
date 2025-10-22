import React from "react";
import { motion } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";

// Modern dijital sayı komponenti
const DigitalNumber = React.memo(({ value, label }) => {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        {/* Ana kart */}
        <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl rounded-2xl p-8 border border-purple-500/50 shadow-2xl shadow-purple-500/20">
          <div
            className="text-7xl md:text-8xl font-bold text-white"
            style={{ 
              fontFamily: "'Quicksand', sans-serif",
              textShadow: "0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)"
            }}
          >
            {String(displayValue).padStart(2, "0")}
          </div>
          
          {/* Işıltı efekti */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Parlayan halka */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      </div>
      
      {/* Label */}
      <p className="text-gray-400 text-lg md:text-xl font-semibold mt-4 uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
});

DigitalNumber.displayName = 'DigitalNumber';

// Yüzen partikül
const FloatingParticle = React.memo(({ particle }) => (
  <motion.div
    className="absolute"
    style={{
      left: particle.left,
      top: particle.top,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, particle.xOffset, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: particle.duration,
      repeat: Infinity,
      delay: particle.delay,
      ease: "easeInOut",
    }}
  >
    <div className="text-2xl">{particle.emoji}</div>
  </motion.div>
));

FloatingParticle.displayName = 'FloatingParticle';

// Partikül listesi
const useParticles = () => {
  return React.useMemo(
    () => {
      const emojis = ["🎂", "🎉", "🎈", "🎁", "✨", "💝", "🌟", "💖", "🎊", "🥳"];
      return [...Array(15)].map((_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 3,
        xOffset: (Math.random() - 0.5) * 40,
      }));
    },
    []
  );
};

const CountdownPage = () => {
  const timeLeft = useCountdown();
  const particles = useParticles();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animasyonlu arka plan dalgaları */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
            `,
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      {/* Işık efektleri */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.1, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Ana içerik */}
      <div className="relative z-10 text-center px-4 max-w-7xl w-full">
        {/* Üst kısım - İkon ve başlık */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-9xl mb-6 inline-block"
          >
            🔒
          </motion.div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                  "0 0 40px rgba(236, 72, 153, 0.8)",
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                Henüz Erken!
              </span>
            </motion.h1>
            <span className="text-6xl md:text-8xl">💝</span>
          </div>

          <motion.p 
            className="text-white/90 text-2xl md:text-3xl font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Bu sürpriz doğum gününde açılacak! 🎂✨
          </motion.p>
        </motion.div>

        {/* Geri sayım */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-12">
          <DigitalNumber value={timeLeft.months} label="Ay" />
          <DigitalNumber value={timeLeft.days} label="Gün" />
          <DigitalNumber value={timeLeft.hours} label="Saat" />
          <DigitalNumber value={timeLeft.minutes} label="Dakika" />
          <DigitalNumber value={timeLeft.seconds} label="Saniye" />
        </div>

        {/* Alt mesaj */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
            <motion.p 
              className="text-white text-xl md:text-2xl font-light"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Sabret, güzel şeyler bekleyenleredir... ⏳💖
            </motion.p>
          </div>
          
          {/* Parlayan halka */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-20" />
        </motion.div>
      </div>

      {/* Yüzen partikül efektleri */}
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} particle={particle} />
      ))}
    </div>
  );
};

export default CountdownPage;
