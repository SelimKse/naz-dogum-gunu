import React from "react";
import { motion } from "framer-motion";

const NazAnsiklopedisi = () => {
  const superPowers = [
    "Gülümsemesiyle dünyayı aydınlatmak ✨",
    "Kalpleri çalmak (yasal olmayan yöntemlerle) 💙",
    "Stitch kadar sevimli olmak 🥰",
    "Herkesi mutlu etmek 😊",
    "Mavi rengi daha da güzel göstermek 💙",
  ];

  const facts = [
    "En sevdiği renk mavi ve mor 💜💙",
    "Stitch karakterine bayılır 👽",
    "Gülümsemesi bulaşıcıdır 😊",
    "Harika bir arkadaştır 👯‍♀️",
    "Doğum günleri onun için çok özeldir 🎂",
  ];

  const threeWords = [
    { text: "Sevimli", emoji: "🥰" },
    { text: "Eğlenceli", emoji: "🎉" },
    { text: "Muhteşem", emoji: "✨" },
  ];

  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <div className="w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-4 font-quicksand"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="gradient-text">Naz'ın Ansiklopedisi</span>
          <span className="inline-block"> 📚</span>
        </motion.h1>

        <motion.p
          className="text-xl text-purple-300 text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Naz hakkında bilmek istediğiniz her şey burada! ✨
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
          <motion.div
            className="card space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="inline-block">🦸</span>
              <span className="gradient-text">Naz'ın Süper Güçleri</span>
            </h2>
            <ul className="space-y-3">
              {superPowers.map((power, index) => (
                <motion.li
                  key={index}
                  className="text-gray-200 flex items-start gap-2 p-3 bg-gray-800/50 rounded-xl border border-purple-500/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <span className="text-purple-400 font-bold">•</span>
                  {power}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="card space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="inline-block">🎯</span>
              <span className="gradient-text">Naz Hakkında 5 Gerçek</span>
            </h2>
            <ul className="space-y-3">
              {facts.map((fact, index) => (
                <motion.li
                  key={index}
                  className="text-gray-200 flex items-start gap-2 p-3 bg-gray-800/50 rounded-xl border border-pink-500/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <span className="text-pink-400 font-bold">•</span>
                  {fact}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="card space-y-4 md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="inline-block">💭</span>
              <span className="gradient-text whitespace-nowrap">
                Naz = 3 Kelimeyle
              </span>
            </h2>
            <div className="space-y-4">
              {threeWords.map((word, index) => (
                <motion.div
                  key={index}
                  className="text-gray-200 flex items-center gap-3 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border-2 border-purple-500/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, borderColor: "#a78bfa" }}
                >
                  <span className="text-3xl">{word.emoji}</span>
                  <span className="text-xl font-bold gradient-text">
                    {word.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NazAnsiklopedisi;
