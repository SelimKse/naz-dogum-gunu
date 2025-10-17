import React from "react";
import { motion } from "framer-motion";
import Confetti from "../components/Confetti";
import PhotoCard from "../components/PhotoCard";
import CharacterCard from "../components/CharacterCard";

const Home = () => {
  // Memoized photo data
  const photos = React.useMemo(() => [
    {
      src: "/assets/images/photos/photo1.jpg",
      alt: "Güzel Anılar",
      title: "Güzel Anılar",
      placeholderIcon: "📸",
      placeholderText: "Fotoğraf eklenecek"
    },
    {
      src: "/assets/images/photos/photo2.jpg",
      alt: "Doğum Günü Kutlaması",
      title: "Doğum Günü Kutlaması",
      placeholderIcon: "🎂",
      placeholderText: "Doğum günü fotoğrafları"
    },
    {
      src: "/assets/images/photos/photo3.jpg",
      alt: "Özel Günler",
      title: "Özel Günler",
      placeholderIcon: "🌟",
      placeholderText: "Özel günlerin fotoğrafları"
    }
  ], []);

  // Memoized character data
  const characters = React.useMemo(() => [
    {
      src: "/assets/images/icons/stitch.png",
      alt: "Stitch",
      name: "Stitch",
      borderColor: "border-purple-500/20"
    },
    {
      src: "/assets/images/icons/lilo.png",
      alt: "Lilo",
      name: "Lilo",
      borderColor: "border-pink-500/20"
    },
    {
      src: "/assets/images/icons/hawaii.png",
      alt: "Hawaii",
      name: "Hawaii",
      borderColor: "border-purple-500/20"
    },
    {
      src: "/assets/images/icons/ohana.png",
      alt: "Ohana",
      name: "Ohana",
      borderColor: "border-purple-500/20"
    }
  ], []);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Konfeti Animasyonu - Global */}
      <Confetti count={50} />

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
              role="heading"
              aria-level="1"
            >
              <span className="gradient-text">İyi ki Doğdun Naz</span>
              <span className="inline-block" aria-label="doğum günü pastası emojisi">🎂</span>
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
            <h2 className="text-3xl font-bold text-purple-300 mb-8" role="heading" aria-level="2">
              <span aria-label="kutlama emojisi">🎉</span> Özel Anılar <span aria-label="kutlama emojisi">🎉</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {photos.map((photo, index) => (
                <PhotoCard
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.title}
                  index={index}
                  borderColor={index === 1 ? "border-pink-500/20" : "border-purple-500/20"}
                  shadowColor={index === 1 ? "shadow-pink-500/20" : "shadow-purple-500/20"}
                  hoverShadowColor={index === 1 ? "hover:shadow-pink-500/40" : "hover:shadow-purple-500/40"}
                  placeholderIcon={photo.placeholderIcon}
                  placeholderText={photo.placeholderText}
                />
              ))}
            </div>
          </motion.div>

          {/* Stitch Karakter Bölümü */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {characters.map((character) => (
              <CharacterCard
                key={character.src}
                src={character.src}
                alt={character.alt}
                name={character.name}
                borderColor={character.borderColor}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
