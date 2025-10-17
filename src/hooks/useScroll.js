import { useState, useEffect } from 'react';

export const useScroll = (selector = '.snap-y') => {
  const [isFirstSection, setIsFirstSection] = useState(true);

  useEffect(() => {
    const scrollContainer = document.querySelector(selector);

    const handleScroll = () => {
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const viewportHeight = window.innerHeight;
        setIsFirstSection(scrollTop < viewportHeight * 0.5);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // İlk yükleme için kontrol et
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selector]);

  const scrollToSection = (sectionIndex, behavior = 'smooth') => {
    const scrollContainer = document.querySelector(selector);
    const sections = scrollContainer?.querySelectorAll("section");

    if (sections && sections[sectionIndex]) {
      sections[sectionIndex].scrollIntoView({ 
        behavior, 
        block: "start" 
      });
    }
  };

  return {
    isFirstSection,
    scrollToSection,
  };
};
