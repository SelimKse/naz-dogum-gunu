import React from "react";
import { motion } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";

// Memoized DigitalNumber component - sadece value değiştiğinde render olsun
const DigitalNumber = React.memo(({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      {/* Dijital saat çerçevesi */}
      <div className="bg-black rounded-2xl p-6 border-4 border-cyan-500/30 shadow-2xl shadow-cyan-500/50 backdrop-blur-sm">
        <div
          className="text-6xl md:text-7xl font-mono font-bold text-cyan-400 tracking-wider min-w-[120px] text-center"
          style={{
            textShadow:
              "0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)",
            fontFamily: "'Orbitron', monospace",
          }}
        >
          {String(value).padStart(2, "0")}
        </div>
        {/* Dijital saat ışık efekti */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
      </div>
      {/* Sabit glow efekti - animasyon yok */}
      <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-xl pointer-events-none" />
    </div>
    {/* Label */}
    <p className="text-cyan-300 text-sm md:text-base font-semibold mt-3 uppercase tracking-widest">
      {label}
    </p>
  </div>
));

DigitalNumber.displayName = 'DigitalNumber';

// Memoized Star component
const Star = React.memo(({ star }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
    style={{
      left: star.left,
      top: star.top,
    }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: star.duration,
      repeat: Infinity,
      delay: star.delay,
    }}
  />
));

Star.displayName = 'Star';


// Memoized stars array
const useStars = () => {
  return React.useMemo(
    () =>
      [...Array(20)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    []
  );
};

const CountdownPage = () => {
  const timeLeft = useCountdown();
  const stars = useStars();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Arka plan animasyonlu grid - static */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Ana içerik */}
      <div className="relative z-10 text-center px-4 max-w-6xl">
        {/* Kilit ikonu */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-8xl mb-8"
        >
          🔒
        </motion.div>

        {/* Başlık */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Henüz Erken!
          </h1>
          <span className="text-5xl md:text-6xl">💝</span>
        </div>

        <p className="text-gray-300 text-xl md:text-2xl mb-12">
          Bu sayfa doğum gününde açılacak! 🎂✨
        </p>

        {/* Geri sayım sayaçları */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8">
          <DigitalNumber value={timeLeft.months} label="AY" />
          <DigitalNumber value={timeLeft.days} label="GÜN" />
          <DigitalNumber value={timeLeft.hours} label="SAAT" />
          <DigitalNumber value={timeLeft.minutes} label="DAKİKA" />
          <DigitalNumber value={timeLeft.seconds} label="SANİYE" />
        </div>

        {/* Alt mesaj */}
        <div className="mt-12 p-6 bg-purple-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30">
          <p className="text-purple-300 text-lg">
            Sabret, güzel şeyler bekleyenleredir... ⏳💖
          </p>
        </div>
      </div>

      {/* Parıldayan yıldızlar - bir kez oluştur */}
      {stars.map((star) => (
        <Star key={star.id} star={star} />
      ))}
    </div>
  );
};

export default CountdownPage;
