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
import NotFound from "./pages/NotFound";
import { motion, AnimatePresence } from "framer-motion";

// Dijital Saat Görünümlü Geri Sayım Sayfası
const CountdownPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchTargetDate = async () => {
      try {
        const response = await fetch("/api/protection-settings");
        if (!response.ok) throw new Error("Ayarlar yüklenemedi");
        const settings = await response.json();
        return new Date(settings.targetDate);
      } catch (error) {
        console.error("Hedef tarih alınamadı:", error);
        return new Date("2026-04-21"); // Fallback
      }
    };

    const calculateTimeLeft = async () => {
      const targetDate = await fetchTargetDate();

      const updateCountdown = () => {
        const now = new Date();
        const difference = targetDate - now;

        if (difference > 0) {
          // Tam ay hesaplama
          let months = 0;
          let tempDate = new Date(now);
          while (tempDate < targetDate) {
            tempDate.setMonth(tempDate.getMonth() + 1);
            if (tempDate <= targetDate) months++;
            else break;
          }
          tempDate.setMonth(tempDate.getMonth() - 1);

          // Kalan günler
          const remainingMs = targetDate - tempDate;
          const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

          setTimeLeft({ months, days, hours, minutes, seconds });
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    };

    calculateTimeLeft();
  }, []);

  // Memoize DigitalNumber component - sadece value değiştiğinde render olsun
  const DigitalNumber = React.memo(({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Dijital saat çerçevesi */}
        <div className="bg-black rounded-2xl p-6 border-4 border-cyan-500/30 shadow-2xl shadow-cyan-500/50 backdrop-blur-sm">
          <div
            className="text-6xl md:text-7xl font-mono font-bold text-cyan-400 tracking-wider min-w-[120px] text-center"
            style={{
              textShadow:
                "0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)",
              fontFamily: "'Orbitron', monospace",
            }}
          >
            {String(value).padStart(2, "0")}
          </div>
          {/* Dijital saat ışık efekti */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
        </div>
        {/* Sabit glow efekti - animasyon yok */}
        <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-xl pointer-events-none" />
      </div>
      {/* Label */}
      <p className="text-cyan-300 text-sm md:text-base font-semibold mt-3 uppercase tracking-widest">
        {label}
      </p>
    </div>
  ));

  // Yıldızları bir kez oluştur - her render'da yeniden oluşmasın
  const stars = React.useMemo(
    () =>
      [...Array(20)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Arka plan animasyonlu grid - static */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Ana içerik */}
      <div className="relative z-10 text-center px-4 max-w-6xl">
        {/* Kilit ikonu */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-8xl mb-8"
        >
          🔒
        </motion.div>

        {/* Başlık */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Henüz Erken!
          </h1>
          <span className="text-5xl md:text-6xl">💝</span>
        </div>

        <p className="text-gray-300 text-xl md:text-2xl mb-12">
          Bu sayfa doğum gününde açılacak! 🎂✨
        </p>

        {/* Geri sayım sayaçları */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8">
          <DigitalNumber value={timeLeft.months} label="AY" />
          <DigitalNumber value={timeLeft.days} label="GÜN" />
          <DigitalNumber value={timeLeft.hours} label="SAAT" />
          <DigitalNumber value={timeLeft.minutes} label="DAKİKA" />
          <DigitalNumber value={timeLeft.seconds} label="SANİYE" />
        </div>

        {/* Alt mesaj */}
        <div className="mt-12 p-6 bg-purple-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30">
          <p className="text-purple-300 text-lg">
            Sabret, güzel şeyler bekleyenleredir... ⏳💖
          </p>
        </div>
      </div>

      {/* Parıldayan yıldızlar - bir kez oluştur */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: star.left,
            top: star.top,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

// Merkezi Koruma Sistemi Component
const ProtectionWrapper = ({ children, pageName }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProtection = async () => {
      try {
        // MongoDB'den ayarları çek
        const response = await fetch("/api/protection-settings");

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
    return <CountdownPage />;
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
        // MongoDB'den ayarları çek
        const response = await fetch("/api/protection-settings");

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
          <Route path="*" element={<NotFound />} />
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
