import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { characterCardPropTypes } from "../utils/propTypes";

const CharacterCard = React.memo(({ 
  src, 
  alt, 
  name, 
  borderColor = "border-purple-500/20"
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      className={`text-center p-4 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border ${borderColor}`}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-24 w-24 mx-auto mb-3 flex items-center justify-center overflow-hidden">
        {!imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain rounded-lg"
            onError={handleImageError}
          />
        ) : (
          <span className="text-2xl">❓</span>
        )}
      </div>
      <p className="text-sm text-purple-300 font-medium">{name}</p>
    </motion.div>
  );
});

CharacterCard.displayName = 'CharacterCard';

CharacterCard.propTypes = characterCardPropTypes;

export default CharacterCard;
