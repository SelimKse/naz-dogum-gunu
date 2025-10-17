import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProtection } from "../hooks/useProtection";
import { useScroll } from "../hooks/useScroll";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

const StepNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFirstSection, scrollToSection } = useScroll();
  const [isPageBlocked, setIsPageBlocked] = React.useState(false);

  const steps = [
    { path: "/", name: "Ana Sayfa", icon: "🏠" },
    { path: "/timeline", name: "Hikayemiz", icon: "📅" },
    { path: "/ansiklopedi", name: "Ansiklopedi", icon: "📖" },
    { path: "/hayaller", name: "Hayaller", icon: "✨" },
    { path: "/surpriz", name: "Sürpriz", icon: "🎁" },
    { path: "/hediyen", name: "Hediye", icon: "💝" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );
  const nextStep = steps[currentStepIndex + 1];
  const prevStep = steps[currentStepIndex - 1];

  // Mevcut sayfanın kilitli olup olmadığını kontrol et
  React.useEffect(() => {
    const checkPageProtection = async () => {
      // Sayfa adını path'den çıkar
      const pageNameMap = {
        "/": "home",
        "/timeline": "timeline",
        "/ansiklopedi": "ansiklopedi",
        "/hayaller": "hayaller",
        "/surpriz": "surpriz",
        "/hediyen": "hediyen",
      };

      const pageName = pageNameMap[location.pathname];
      if (!pageName) {
        setIsPageBlocked(false);
        return;
      }

      try {
        // MongoDB'den ayarları çek
        const response = await fetch("/api/protection-settings");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Ayarlar yüklenemedi`);
        }

        // Response'un JSON olup olmadığını kontrol et
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API response JSON değil");
        }

        const settings = await response.json();

        if (!settings.protectionEnabled || !settings.pages[pageName]) {
          setIsPageBlocked(false);
          return;
        }

        const currentDate = new Date();
        const targetDate = new Date(settings.targetDate);

        setIsPageBlocked(currentDate < targetDate);
      } catch (error) {
        console.error("Koruma kontrolü hatası:", error);
        setIsPageBlocked(false);
      }
    };

    checkPageProtection();
  }, [location.pathname]);

  // Ana sayfada scroll dinleyicisi - artık useScroll hook'u kullanıyor

  // Ana sayfada scroll pozisyonunu kontrol et
  const handleNextClick = React.useCallback(() => {
    if (location.pathname === "/") {
      // İlk section'da mıyız?
      if (isFirstSection) {
        // İkinci section'a scroll yap
        scrollToSection(1);
        return;
      }
    }

    // Diğer durumlarda normal sayfa geçişi yap
    if (nextStep) {
      navigate(nextStep.path);
    }
  }, [location.pathname, isFirstSection, scrollToSection, nextStep, navigate]);

  // Ana sayfada geri butonunu kontrol et
  const handleBackClick = React.useCallback(() => {
    if (location.pathname === "/") {
      // İkinci section'da mıyız?
      if (!isFirstSection) {
        // İlk section'a scroll yap
        scrollToSection(0);
        return;
      }
    }

    // Diğer durumlarda normal sayfa geçişi yap
    if (prevStep) {
      navigate(prevStep.path);
    }
  }, [location.pathname, isFirstSection, scrollToSection, prevStep, navigate]);

  // Keyboard navigation
  useKeyboardNavigation(handleNextClick, handleBackClick);

  // Admin sayfasında veya sayfa kilitliyse navigation gösterme
  if (location.pathname === "/admin" || isPageBlocked) return null;

  // Surpriz sayfasında sadece geri butonu
  const isSurprizPage = location.pathname === "/surpriz";

  // Geri butonunu göster/gizle kontrolü
  const shouldShowBackButton =
    (location.pathname === "/" && !isFirstSection) || // Ana sayfada ikinci section'da
    (location.pathname !== "/" && prevStep); // Diğer sayfalarda prevStep varsa

  return (
    <AnimatePresence>
      {/* Geri Butonu - Sol altta */}
      {shouldShowBackButton && (
        <motion.div
          className="fixed bottom-8 left-8 z-50"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={handleBackClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 border-2 border-purple-400/30 shadow-lg shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Önceki sayfaya git"
            role="button"
            tabIndex={0}
          >
            <span className="text-xl">←</span>
            <span className="text-lg">Geri</span>
          </motion.button>
        </motion.div>
      )}

      {/* İleri Butonu - Sağ altta (Surpriz sayfası hariç) */}
      {!isSurprizPage && nextStep && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={handleNextClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 border-2 border-purple-400/30 shadow-lg shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Sonraki sayfaya git"
            role="button"
            tabIndex={0}
          >
            <span className="text-lg">İlerle</span>
            <span className="text-xl">→</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepNavigation;
