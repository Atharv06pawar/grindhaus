import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
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

const App = () => {

  // 🎬 CINEMATIC GLOBAL SCROLL ENGINE
  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.6,              // 🎬 cinematic glide time
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 0.8,       // 🎯 lower sensitivity (premium feel)
      touchMultiplier: 1.1,
      infinite: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };

  }, []);

  return (
    <AppLoaderWrapper>
      <Container>

        {/* Navbar */}
        <Header />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/technique" element={<Technique />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        {/* Footer */}
        <Footer />

      </Container>
    </AppLoaderWrapper>
  );
};

export default App;
