import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    
      <Container>
        {/* Navbar always on top */}
        <Header />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/technique" element={<Technique />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        {/* Footer always at bottom */}
        <Footer />
      </Container>
    
  );
};

export default App;
