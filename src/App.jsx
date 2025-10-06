import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Timeline from "./pages/Timeline";
import NazAnsiklopedisi from "./pages/NazAnsiklopedisi";
import Hayaller from "./pages/Hayaller";
import Surpriz from "./pages/Surpriz";
import Hediyen from "./pages/Hediyen";
import Admin from "./pages/Admin";
import { motion, AnimatePresence } from "framer-motion";

// Merkezi Koruma Sistemi Component
const ProtectionWrapper = ({ children, pageName }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProtection = async () => {
      try {
        // Vercel için direkt public JSON'dan oku
        const response = await fetch("/assets/data/protection-settings.json");
        
        if (!response.ok) {
          throw new Error("Ayarlar yüklenemedi");
        }

        const settings = await response.json();
        
        // Koruma kapalıysa veya sayfa korumasız ise kontrol yapma
        if (!settings.protectionEnabled || !settings.pages[pageName]) {
          setIsBlocked(false);
          setIsLoading(false);
          return;
        }

        const currentDate = new Date();
        const targetDate = new Date(settings.targetDate);

        // Bugünün tarihi hedef tarihten önceyse engelle
        if (currentDate < targetDate) {
          setIsBlocked(true);
        } else {
          setIsBlocked(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Koruma ayarları yükleme hatası:", error);
        // Hata durumunda default olarak erişime izin ver
        setIsBlocked(false);
        setIsLoading(false);
      }
    };

    checkProtection();
  }, [pageName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="text-6xl mb-4"
          >
            ⏳
          </motion.div>
          <p className="text-purple-300 text-lg">Yükleniyor...</p>
        </motion.div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-purple-500/20 max-w-md text-center border-4 border-purple-500/30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-6"
          >
            🔒
          </motion.div>
          <h2 className="text-3xl font-bold text-purple-400 mb-4">
            Henüz Erken! 💝
          </h2>
          <p className="text-gray-300 text-lg">
            Bu sayfa şu an kilitli. Doğum günün gelince açılacak! 🎂✨
          </p>
        </motion.div>
      </div>
    );
  }

  return children;
};

// Step Navigation Component
const StepNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFirstSection, setIsFirstSection] = React.useState(true);
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
        // Vercel için direkt public JSON'dan oku
        const response = await fetch("/assets/data/protection-settings.json");
        
        if (!response.ok) {
          throw new Error("Ayarlar yüklenemedi");
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

  // Ana sayfada scroll dinleyicisi
  React.useEffect(() => {
    if (location.pathname === "/") {
      const scrollContainer = document.querySelector(".snap-y");

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
    } else {
      setIsFirstSection(true);
    }
  }, [location.pathname]);

  // Ana sayfada scroll pozisyonunu kontrol et
  const handleNextClick = () => {
    if (location.pathname === "/") {
      const scrollContainer = document.querySelector(".snap-y");
      const sections = scrollContainer?.querySelectorAll("section");

      if (sections && sections.length > 1) {
        const scrollTop = scrollContainer.scrollTop;
        const viewportHeight = window.innerHeight;

        // İlk section'da mıyız? (scroll pozisyonu 0'a yakın)
        if (scrollTop < viewportHeight * 0.5) {
          // İkinci section'a scroll yap
          sections[1]?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
    }

    // Diğer durumlarda normal sayfa geçişi yap
    if (nextStep) {
      navigate(nextStep.path);
    }
  };

  // Ana sayfada geri butonunu kontrol et
  const handleBackClick = () => {
    if (location.pathname === "/") {
      const scrollContainer = document.querySelector(".snap-y");
      const sections = scrollContainer?.querySelectorAll("section");

      if (sections && sections.length > 1) {
        const scrollTop = scrollContainer.scrollTop;
        const viewportHeight = window.innerHeight;

        // İkinci section'da mıyız? (scroll pozisyonu viewport yüksekliğinden fazla)
        if (scrollTop >= viewportHeight * 0.5) {
          // İlk section'a scroll yap
          sections[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
    }

    // Diğer durumlarda normal sayfa geçişi yap
    if (prevStep) {
      navigate(prevStep.path);
    }
  };

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
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 border-2 border-purple-400/30 shadow-lg shadow-purple-500/50"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 border-2 border-purple-400/30 shadow-lg shadow-purple-500/50"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">İlerle</span>
            <span className="text-xl">→</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function AppContent() {
  return (
    <div className="min-h-screen">
      <main className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectionWrapper pageName="home">
                <Home />
              </ProtectionWrapper>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectionWrapper pageName="timeline">
                <Timeline />
              </ProtectionWrapper>
            }
          />
          <Route
            path="/ansiklopedi"
            element={
              <ProtectionWrapper pageName="ansiklopedi">
                <NazAnsiklopedisi />
              </ProtectionWrapper>
            }
          />
          <Route
            path="/hayaller"
            element={
              <ProtectionWrapper pageName="hayaller">
                <Hayaller />
              </ProtectionWrapper>
            }
          />
          <Route
            path="/surpriz"
            element={
              <ProtectionWrapper pageName="surpriz">
                <Surpriz />
              </ProtectionWrapper>
            }
          />
          <Route
            path="/hediyen"
            element={
              <ProtectionWrapper pageName="hediyen">
                <Hediyen />
              </ProtectionWrapper>
            }
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <StepNavigation />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
