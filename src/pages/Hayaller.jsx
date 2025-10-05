import React from "react";
import { motion } from "framer-motion";

const Hayaller = () => {
  const [flipped, setFlipped] = React.useState({});

  const dreams = [
    {
      icon: "✈️",
      title: "Seyahat Hayalleri",
      description:
        "En çok Fransa'yı görmek, Sevdiğin insanlarla yeni yerler keşfetmek.",
      colors: "from-blue-800 to-purple-950",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", // Paris Eyfel Kulesi
      backText: "Hayallerindeki her yere gideceğiz! ✈️🗼",
    },
    {
      icon: "🎶",
      title: "Müzik Dünyası",
      description: "En sevdiği şarkıları dinlemek, konserler, müzikal anılar",
      colors: "from-purple-800 to-pink-950",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800", // Konser
      backText: "Müzik ruhunu beslesin! 🎶🎵 \nGökhan Türkmen - Derdim",
    },
    {
      icon: "☕",
      title: "Keyifli Anlar",
      description: "Sıcak kahveler, güzel sohbetler, huzurlu zamanlar",
      colors: "from-pink-800 to-blue-950",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", // Kahve
      backText: "Hatırı Olması Gereken Günlere! ☕💭",
    },
    {
      icon: "🎨",
      title: "Yaratıcılık",
      description: "Sanat, yaratıcı projeler ve hayallerin gerçekleşmesi",
      colors: "from-blue-900 to-purple-950",
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800", // Sanat
      backText: "Yaratıcılığın sınırı yok! 🎨✨",
    },
    {
      icon: "🌟",
      title: "Büyük Hayaller",
      description:
        "Tüm hayallerinin gerçekleşmesi ve mutluluk dolu bir gelecek",
      colors: "from-purple-900 to-pink-950",
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800", // Yıldızlı gökyüzü
      backText: "Her hayalin gerçek olacak! 🌟💫",
    },
    {
      icon: "💙",
      title: "Stitch ile Maceralar",
      description: "En sevdiği karakter Stitch gibi eğlenceli maceralar",
      colors: "from-blue-800 to-blue-950",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", // Hawaii
      backText: "Ohana means family! 💙🌺",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-2 flex items-center justify-center">
      <div className="container mx-auto max-w-7xl">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-4 font-quicksand"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="gradient-text">Naz'ın Hayalleri</span>
          <span className="inline-block"> ✨</span>
        </motion.h1>

        <motion.p
          className="text-xl text-purple-300 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Gerçekleşmesi gereken güzel hayaller 💫
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dreams.map((dream, index) => (
            <motion.div
              key={index}
              className="relative h-60 cursor-pointer"
              style={{ perspective: "1000px" }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onHoverStart={() => setFlipped({ [index]: true })}
              onHoverEnd={() => setFlipped({ [index]: false })}
              onClick={() => setFlipped({ [index]: !flipped[index] })}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped[index] ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              >
                {/* Ön Yüz */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${dream.colors} p-6 rounded-3xl text-white shadow-xl flex flex-col items-center justify-center`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <motion.div
                    className="text-5xl mb-4 text-center"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {dream.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-center">
                    {dream.title}
                  </h3>

                  <p className="text-center text-white/90 leading-relaxed">
                    {dream.description}
                  </p>
                </div>

                {/* Arka Yüz */}
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {/* Arka Plan Resim */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${dream.image})` }}
                  />

                  {/* Blur ve Karartma Overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <motion.p
                      className="text-white text-2xl font-bold text-center whitespace-pre-line"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: flipped[index] ? 1 : 0,
                        y: flipped[index] ? 0 : 20,
                      }}
                      transition={{ delay: 0.3 }}
                    >
                      {dream.backText}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hayaller;
