// nutrihero.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import heroImg from "../assets/nutrition/nhero.png";

/* ========= ANIMATION VARIANT ========= */

const heroAnim = {
  hidden: { opacity: 0, scale: 1.08 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: "easeOut"
    }
  }
};

/* ========= STYLED ========= */

const HeroSection = styled(motion.section)`
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

/* ========= COMPONENT ========= */

const NutriHero = () => {
  return (
    <HeroSection
      variants={heroAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <HeroImage src={heroImg} alt="Nutrition Hero" />
    </HeroSection>
  );
};

export default NutriHero;
