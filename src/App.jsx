import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import StepNavigation from "./components/StepNavigation";
import ErrorBoundary from "./components/ErrorBoundary";


function AppContent() {
  return (
    <ErrorBoundary>
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
