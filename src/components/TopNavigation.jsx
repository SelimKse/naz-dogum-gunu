import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const TopNavigation = ({ storyTimer }) => {
  const location = useLocation();

  // Admin sayfasında navigation gösterme
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 left-0 right-0 z-50 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Story Timer */}
        {storyTimer}
      </motion.div>
    </AnimatePresence>
  );
};

TopNavigation.propTypes = {
  storyTimer: PropTypes.node,
};

export default TopNavigation;
