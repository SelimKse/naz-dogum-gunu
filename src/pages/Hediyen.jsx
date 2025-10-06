import React, { useRef, useMemo, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";

// Partikülleri ayrı memoized komponent olarak tanımla
const BackgroundParticles = React.memo(() => {
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => {
      const row = Math.floor(i / 6);
      const col = i % 6;
      return {
        id: `particle-${i}`,
        xBase: col * 20 + Math.random() * 10,
        yBase: row * 20 + Math.random() * 10,
        yOffset: -8 + Math.random() * 16,
        xOffset: -5 + Math.random() * 10,
        rotation: Math.random() * 180,
        duration: 6 + Math.random() * 4,
        delay: Math.random() * 3,
        emoji: ["🎁", "🎂", "🎈", "⭐", "💝", "🎉", "✨"][
          Math.floor(Math.random() * 7)
        ],
      };
    });
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl filter-none"
          style={{
            left: `${particle.xBase}%`,
            top: `${particle.yBase}%`,
          }}
          animate={{
            y: [0, particle.yOffset, 0],
            x: [0, particle.xOffset, 0],
            rotate: [0, particle.rotation],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </>
  );
});

BackgroundParticles.displayName = "BackgroundParticles";

const Hediyen = () => {
  const componentRef = useRef();
  const [isBoxOpen, setIsBoxOpen] = React.useState(false);
  const [lidRotation, setLidRotation] = React.useState({ x: 0, y: 0 });
  const [pdfUrl, setPdfUrl] = useState(null);

  // PDF URL'ini Vercel Blob'dan al
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await fetch("/api/list-assets");
        if (response.ok) {
          const data = await response.json();
          const url = data.assets["nazin-kitabi.pdf"];
          if (url) {
            setPdfUrl(url);
            console.log("✅ PDF URL alındı:", url);
          } else {
            console.warn("⚠️ PDF Blob'da bulunamadı, fallback kullanılıyor");
            setPdfUrl("/assets/documents/nazin-kitabi.pdf"); // Fallback
          }
        }
      } catch (error) {
        console.error("❌ PDF URL alınamadı:", error);
        setPdfUrl("/assets/documents/nazin-kitabi.pdf"); // Fallback
      }
    };

    fetchPdfUrl();
  }, []);

  const handleDownloadPDF = () => {
    if (!pdfUrl) {
      console.error("PDF URL henüz yüklenmedi");
      return;
    }
    
    // PDF dosyasını indir (Blob URL'den)
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Nazin-Kitabi.pdf";
    link.target = "_blank"; // Blob URL'ler için yeni tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 relative overflow-hidden select-none">
      {/* Hafif arka plan parıltıları */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-naz-purple-400 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-naz-blue-400 rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Partikül efektleri - Dağınık emoji'ler - Yavaş hareket */}
        <BackgroundParticles />
      </div>{" "}
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        {!isBoxOpen ? (
          // 3D Hediye Kutusu - Kapalı
          <motion.div
            className="flex flex-col items-center justify-center min-h-[60vh]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ perspective: "1000px" }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-24"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.05, 1],
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <span className="inline-block">🎁</span>
              <span className="gradient-text">Kapağı Sürükle ve Aç!</span>
            </motion.h2>

            <div className="relative" style={{ perspective: "1500px" }}>
              {/* 3D Kutu - Ana Gövde */}
              <motion.div
                className="relative w-96 h-96"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Ana Kutu Yüzü - Desenli hediye kutusu */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-xl shadow-2xl"
                  style={{
                    boxShadow: "0 40px 100px rgba(168, 85, 247, 0.7)",
                  }}
                >
                  {/* Kutu Desenleri - Noktalar */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-8 h-8 rounded-full bg-white/10"
                        style={{
                          left: `${(i % 5) * 20 + 5}%`,
                          top: `${Math.floor(i / 5) * 10 + 5}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Işık Efekti */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl"></div>
                  {/* Kutu İç Gölgesi */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent rounded-xl"></div>

                  {/* Kutu Üzerinde Kurdele - Yatay (Pembe) */}
                  <div
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 shadow-2xl"
                    style={{ transform: "translateZ(30px)", zIndex: 50 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20"></div>
                    {/* Kurdele dokusu */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute top-0 bottom-0 w-px bg-pink-700/20"
                        style={{ left: `${i * 8.33}%` }}
                      />
                    ))}
                  </div>

                  {/* Kutu Üzerinde Kurdele - Dikey (Pembe) */}
                  <div
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 shadow-2xl"
                    style={{ transform: "translateZ(30px)", zIndex: 50 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/20"></div>
                    {/* Kurdele dokusu */}
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute left-0 right-0 h-px bg-pink-700/20"
                        style={{ top: `${i * 10}%` }}
                      />
                    ))}
                  </div>

                  {/* Fiyonk - Sol Üst */}
                  <motion.div
                    className="absolute text-6xl filter drop-shadow-2xl"
                    style={{
                      top: "48%",
                      left: "45%",
                      transform: "translate(-50%, -50%) translateZ(35px)",
                      zIndex: 51,
                    }}
                    animate={{
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🎀
                  </motion.div>
                </div>

                {/* Kutu Kapağı - Her zaman gözüksün */}
                <AnimatePresence>
                  {!isBoxOpen && (
                    <motion.div
                      className="absolute left-0 right-0 cursor-grab active:cursor-grabbing"
                      style={{
                        top: 0,
                        height: "160px",
                        transformStyle: "preserve-3d",
                        transformOrigin: "bottom center",
                      }}
                      drag={true}
                      dragConstraints={{
                        top: -150,
                        bottom: 0,
                        left: -15,
                        right: 15,
                      }}
                      dragElastic={0.075}
                      dragSnapToOrigin
                      onDrag={(event, info) => {
                        // Gelişmiş yer çekimi simülasyonu
                        const xRotation = info.offset.x / 8; // Yatay → Z rotasyonu
                        const yRotation = info.offset.y / -12; // Dikey → X rotasyonu
                        setLidRotation({ x: yRotation, y: xRotation });
                      }}
                      onDragEnd={(event, info) => {
                        if (info.offset.y < -140) {
                          setIsBoxOpen(true);
                        } else {
                          // Kapak yerine düşsün
                          setLidRotation({ x: 0, y: 0 });
                        }
                      }}
                      initial={{
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        rotateZ: 0,
                      }}
                      animate={{
                        opacity: 1,
                        y: [0, -15, 0],
                        rotateX: lidRotation.x,
                        rotateZ: lidRotation.y,
                      }}
                      transition={{
                        opacity: { duration: 0.4 },
                        y: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        rotateX: {
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                        },
                        rotateZ: {
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                        },
                      }}
                      whileHover={{ scale: 1.005 }}
                    >
                      {/* Kapak - 3D yapı */}
                      <div
                        className="w-full h-full rounded-t-xl shadow-2xl relative"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: "translateZ(52px)",
                        }}
                      >
                        {/* Kapak Üst Yüzü - Desenli */}
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-400 to-pink-500 rounded-t-xl"
                          style={{
                            boxShadow:
                              "0 -20px 50px rgba(168, 85, 247, 0.7), inset 0 8px 20px rgba(255,255,255,0.25)",
                          }}
                        >
                          {/* Kapak Desenleri - Çizgiler */}
                          <div className="absolute inset-0 rounded-t-xl overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute h-1 bg-white/10"
                                style={{
                                  left: "10%",
                                  right: "10%",
                                  top: `${(i + 1) * 12}%`,
                                }}
                              />
                            ))}
                          </div>

                          {/* Kapak Desenleri - Yıldızlar */}
                          <div className="absolute inset-0 rounded-t-xl">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute text-white/15 text-2xl"
                                style={{
                                  left: `${20 + (i % 3) * 25}%`,
                                  top: `${20 + Math.floor(i / 3) * 40}%`,
                                }}
                              >
                                ⭐
                              </div>
                            ))}
                          </div>

                          {/* Üst Işık Efekti */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent rounded-t-xl"></div>

                          {/* Kenar Gölgesi */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-t-xl"></div>
                        </div>

                        {/* Kapak Alt Kenar */}
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-700 via-purple-600 to-pink-700 shadow-inner"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Kutu İçindeki Parıltılar */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{
                    opacity: [0.5, 0.9, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                ></motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Kutu Açıldığında - Mevcut İçerik
          <>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 font-quicksand relative">
                <span className="gradient-text relative inline-block">
                  HEDİYEN
                </span>

                <span className="inline-block ml-3 text-6xl md:text-7xl">
                  🎁
                </span>
              </h1>

              {/* Alt çizgi efekti */}
              <motion.div
                className="w-64 h-1 mx-auto mb-3 relative overflow-hidden rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #8B5CF6, #3B82F6, #8B5CF6, transparent)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-75"
                  animate={{
                    x: [-100, 400],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </motion.div>
            <motion.p
              className="text-base md:text-lg text-purple-300 mb-4 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Senin için özel bir kitap yazdım...
            </motion.p>
            <motion.button
              onClick={handleDownloadPDF}
              className="btn-primary text-lg px-8 py-3 relative overflow-hidden mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📚 Sürpriz Kitabımı İndir! 📚
            </motion.button>{" "}
            <motion.div
              ref={componentRef}
              className="bg-gray-900/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl shadow-purple-500/20 print:shadow-none print:rounded-none w-full max-w-4xl mx-auto border-4"
              style={{ borderColor: "#a78bfa" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 gradient-text">
                  Naz'a Özel Kitap
                </h1>
                <p className="text-lg md:text-xl text-purple-300">
                  Doğum Günün Kutlu Olsun!
                </p>
              </div>

              <div className="max-w-3xl mx-auto text-gray-200 text-center">
                <p className="text-sm md:text-base leading-relaxed mb-4">
                  Sevgili Naz, bu kitap senin için, seninle ilgili özel anılarla
                  ve dileklerle dolu. Her sayfasında sana olan sevgimi ve
                  hayranlığımı bulacaksın. Doğum günün kutlu olsun! Yeni yaşın
                  sana sağlık, mutluluk ve başarı getirsin. İyi ki doğdun!
                </p>

                <div className="mt-4 pt-4 border-t-2 border-purple-200">
                  <p className="text-sm font-semibold text-purple-700">
                    ❤️ Sevgiyle, Selim ❤️
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Hediyen;
