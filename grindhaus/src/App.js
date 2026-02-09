import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

import Header from "./components/header.js";
import Footer from "./components/footer.js";
import Home from "./components/home.js";
import Workout from "./components/workout.js";
import Technique from "./components/technique.js";
import Nutrition from "./components/nutrition.js";
import Community from "./components/community.js";
import Login from "./components/login.js";
import Signup from "./components/signup.js";

import { Container } from "./styles.js";
import AppLoaderWrapper from "./components/AppLoaderWrapper";
import GlobalLoader from "./components/GlobalLoader";   // ⭐ SAME LOADER

const App = () => {

  const location = useLocation();
  const lenisRef = useRef(null);

  const [routeLoading, setRouteLoading] = useState(false);

  /* 🎬 CINEMATIC SCROLL ENGINE */
  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.6,
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.1
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();

  }, []);

  /* 🚀 ROUTE CHANGE LOADER + SCROLL TOP */
  useEffect(() => {

    setRouteLoading(true);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 650); // breathing sync feels good here

    return () => clearTimeout(timer);

  }, [location.pathname]);

  return (
    <AppLoaderWrapper>
      <Container>

        <Header />

        {/* ⭐ SAME BREATHING LOADER */}
        {routeLoading && <GlobalLoader />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/technique" element={<Technique />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <Footer />

      </Container>
    </AppLoaderWrapper>
  );
};

export default App;
