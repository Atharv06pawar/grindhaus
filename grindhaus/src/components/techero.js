// TechHero.js
import React from "react";
import styled from "styled-components";
import heroImg from "../assets/technique/techero.png"; // make sure path is right

const HeroSection = styled.section`
  width: 100%;
  background: #000; /* optional, helps image pop if it doesn't cover full height */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 1440px; /* keeps it from being overly stretched on big monitors */
  object-fit: contain;
  display: block; /* removes inline gap below image */
`;

const TechHero = () => {
  return (
    <HeroSection>
      <HeroImage src={heroImg} alt="Technique Hero" />
    </HeroSection>
  );
};

export default TechHero;
