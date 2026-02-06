// nutrihero.js
import React from "react";
import styled from "styled-components";
import heroImg from "../assets/nutrition/nhero.png"; // update path

const HeroSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 0rem;
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const NutriHero = () => {
  return (
    <HeroSection>
      <HeroImage src={heroImg} alt="Nutrition Hero" />
    </HeroSection>
  );
};

export default NutriHero;
