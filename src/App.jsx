import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import ProtectionWrapper from "./components/ProtectionWrapper";
import TopNavigation from "./components/TopNavigation";
import MusicPlayer from "./components/MusicPlayer";
import ErrorBoundary from "./components/ErrorBoundary";
import PageTransition from "./components/PageTransition";
import { useAssets } from "./hooks/useAssets";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const [showNavbar, setShowNavbar] = React.useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = React.useState(false);
  const [globalStoryTimer, setGlobalStoryTimer] = React.useState(null);
  const { assetUrls } = useAssets();

  // Global müzik bilgileri - Blob URL'lerini kullan
  const track = React.useMemo(() => ({
    name: "Derdim",
    artist: "Gökhan Türkmen",
    image: assetUrls["cover.jpg"] || "/assets/music/cover.jpg",
    url: assetUrls["song.mp3"] || "/assets/music/song.mp3",
  }), [assetUrls]);

  // Müziği başlatma fonksiyonu - Home sayfasından çağrılacak
  const startMusic = React.useCallback(() => {
    setIsMusicPlaying(true);
  }, []);

  // Global story timer'ı güncelle
  const updateGlobalTimer = React.useCallback((timerData) => {
    setGlobalStoryTimer(timerData);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Music Player - Tüm sayfalarda */}
        {isMusicPlaying && !isAdminPage && (
          <MusicPlayer track={track} autoPlay={true} />
        )}

        <main className="min-h-screen">
          <PageTransition>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectionWrapper
                    pageName="home"
                    onBlockedChange={setShowNavbar}
                  >
                    <Home
                      onStartMusic={startMusic}
                      onUpdateTimer={updateGlobalTimer}
                    />
                  </ProtectionWrapper>
                }
              />
              <Route
                path="/timeline"
                element={
                  <ProtectionWrapper
                    pageName="timeline"
                    onBlockedChange={setShowNavbar}
                  >
                    <Timeline onUpdateTimer={updateGlobalTimer} />
                  </ProtectionWrapper>
                }
              />
              <Route
                path="/ansiklopedi"
                element={
                  <ProtectionWrapper
                    pageName="ansiklopedi"
                    onBlockedChange={setShowNavbar}
                  >
                    <NazAnsiklopedisi onUpdateTimer={updateGlobalTimer} />
                  </ProtectionWrapper>
                }
              />
              <Route
                path="/hayaller"
                element={
                  <ProtectionWrapper
                    pageName="hayaller"
                    onBlockedChange={setShowNavbar}
                  >
                    <Hayaller onUpdateTimer={updateGlobalTimer} />
                  </ProtectionWrapper>
                }
              />
              <Route
                path="/surpriz"
                element={
                  <ProtectionWrapper
                    pageName="surpriz"
                    onBlockedChange={setShowNavbar}
                  >
                    <Surpriz onUpdateTimer={updateGlobalTimer} />
                  </ProtectionWrapper>
                }
              />
              <Route
                path="/hediyen"
                element={
                  <ProtectionWrapper
                    pageName="hediyen"
                    onBlockedChange={setShowNavbar}
                  >
                    <Hediyen onUpdateTimer={updateGlobalTimer} />
                  </ProtectionWrapper>
                }
              />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/timeline" element={<Admin />} />
              <Route path="/admin/settings" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </main>
        {!isAdminPage && showNavbar && globalStoryTimer && (
          <TopNavigation storyTimer={globalStoryTimer} />
        )}
      </div>
    </ErrorBoundary>
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
