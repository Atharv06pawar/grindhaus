// TechHero.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import heroImg from "../assets/technique/techero.png";

/* ===== ANIMATION VARIANTS ===== */

const sectionAnim = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const imageAnim = {
  hidden: { opacity: 0, y: 40, scale: 1.03 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: "easeOut"
    }
  }
};

/* ===== STYLED ===== */

const HeroSection = styled(motion.section)`
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const HeroImage = styled(motion.img)`
  width: 100%;
  height: auto;
  max-width: 1440px;
  object-fit: contain;
  display: block;
`;

/* ===== COMPONENT ===== */

const TechHero = () => {
  return (
    <HeroSection
      variants={sectionAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <HeroImage
        src={heroImg}
        alt="Technique Hero"
        variants={imageAnim}
      />
    </HeroSection>
  );
};

export default TechHero;
