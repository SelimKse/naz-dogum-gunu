import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { photoCardPropTypes } from "../utils/propTypes";

const PhotoCard = React.memo(({ 
  src, 
  alt, 
  title, 
  index, 
  borderColor = "border-purple-500/20",
  shadowColor = "shadow-purple-500/20",
  hoverShadowColor = "hover:shadow-purple-500/40",
  placeholderIcon = "📸",
  placeholderText = "Fotoğraf eklenecek"
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.article
      className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg ${shadowColor} ${hoverShadowColor} hover:shadow-xl transition-shadow border ${borderColor}`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      role="article"
      aria-labelledby={`photo-title-${index}`}
    >
      <div className="bg-gray-950 rounded-xl h-64 mb-4 overflow-hidden">
        {!imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-purple-500/30">
            <div className="text-center">
              <span className="text-4xl filter-none mb-2 block">
                {placeholderIcon}
              </span>
              <p className="text-purple-400 text-sm">
                {placeholderText}
              </p>
            </div>
          </div>
        )}
      </div>
      <p 
        className="text-center text-purple-300 font-medium"
        id={`photo-title-${index}`}
      >
        {title}
      </p>
    </motion.article>
  );
});

PhotoCard.displayName = 'PhotoCard';

PhotoCard.propTypes = photoCardPropTypes;

export default PhotoCard;
