import React from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLoaderWrapper from "./components/AppLoaderWrapper";
import Footer from "./components/footer.js";
import GlobalLoader from "./components/GlobalLoader";
import Header from "./components/header.js";
import Home from "./components/home.js";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import Community from "./components/community.js";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Workout from "./components/workout.js";
import Technique from "./components/technique.js";
import Nutrition from "./components/nutrition.js";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";
import useLenis from "./hooks/useLenis";
import useRouteTransition from "./hooks/useRouteTransition";
import { Container } from "./styles.js";

function LandingRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
}

function App() {
  const lenisRef = useLenis();
  const { displayLocation, isRouteTransitioning } = useRouteTransition(lenisRef);
  const routeKey = `${displayLocation.pathname}${displayLocation.search}${displayLocation.hash}`;

  return (
    <AppLoaderWrapper>
      <Container>
        <Header />

        <AnimatePresence initial={false}>
          {isRouteTransitioning ? <GlobalLoader key="route-loader" label="Loading page" /> : null}
        </AnimatePresence>

        <PageTransition key={routeKey}>
          <Routes location={displayLocation}>
            <Route path="/" element={<LandingRoute />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/technique" element={<Technique />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>

        <Footer />
      </Container>
    </AppLoaderWrapper>
  );
}

export default App;
