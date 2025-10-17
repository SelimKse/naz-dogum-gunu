import React from "react";
import { motion } from "framer-motion";

// Memoized Confetti Piece component
const ConfettiPiece = React.memo(({ piece }) => (
  <motion.div
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
));

ConfettiPiece.displayName = 'ConfettiPiece';

// Custom hook for confetti pieces
const useConfetti = (count = 50) => {
  return React.useMemo(() => {
    return Array(count)
      .fill()
      .map((_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        delay: Math.random() * 3,
        emoji: ["🦋"][Math.floor(Math.random() * 3)],
      }));
  }, [count]);
};

const Confetti = ({ count = 50 }) => {
  const confettiPieces = useConfetti(count);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </div>
  );
};

export default Confetti;
