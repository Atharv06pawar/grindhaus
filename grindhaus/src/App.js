import React from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";

import Header from "./components/header.js";
import Footer from "./components/footer.js";
import Home from "./components/home.js";
import Workout from "./components/workout.js";
import Technique from "./components/technique.js";
import Nutrition from "./components/nutrition.js";
import Community from "./components/community.js";
import Login from "./components/login.js";
import Signup from "./components/signup.js";
import AppLoaderWrapper from "./components/AppLoaderWrapper";
import GlobalLoader from "./components/GlobalLoader";
import PageTransition from "./components/PageTransition";
import { Container } from "./styles.js";
import useLenis from "./hooks/useLenis";
import useRouteTransition from "./hooks/useRouteTransition";

const App = () => {
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
            <Route path="/" element={<Home />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/technique" element={<Technique />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </PageTransition>

        <Footer />
      </Container>
    </AppLoaderWrapper>
  );
};

export default App;
