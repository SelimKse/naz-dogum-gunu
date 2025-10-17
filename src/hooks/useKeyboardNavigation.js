import { useEffect, useCallback } from 'react';

export const useKeyboardNavigation = (onNext, onPrevious, onEscape) => {
  const handleKeyDown = useCallback((event) => {
    // Alt + Arrow tuşları ile navigasyon
    if (event.altKey) {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        default:
          break;
      }
    }
    
    // Space ve Enter tuşları ile ana butonlara erişim
    if (event.key === ' ' || event.key === 'Enter') {
      const target = event.target;
      if (target.getAttribute('role') === 'button' || target.tagName === 'BUTTON') {
        // Framer Motion butonları için özel işlem
        if (target.closest('[data-framer-motion]')) {
          event.preventDefault();
          target.click();
        }
      }
    }
  }, [onNext, onPrevious, onEscape]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    // Keyboard navigation için yardımcı fonksiyonlar
    focusElement: (selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.focus();
      }
    },
    
    announceToScreenReader: (message) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };
};
