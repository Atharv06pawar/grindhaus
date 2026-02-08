// AICustomDiet.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import aiDietBg from "../assets/nutrition/AIpowered.png";

/* ================= ANIMATIONS ================= */

const sectionAnim = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1 }
  }
};

const contentAnim = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.18
    }
  }
};

const textAnim = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55 }
  }
};

const buttonAnim = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

/* ================= STYLED ================= */

const Section = styled(motion.section)`
  background: url(${aiDietBg}) no-repeat center/cover;
  min-height: 500px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 3rem 1rem;
`;

const Content = styled(motion.div)`
  text-align: center;
  color: white;
  max-width: 700px;

  h2 {
    font-family: "Passero One", cursive;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);

    @media (max-width: 480px) {
      font-size: 1.4rem;
    }
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);

    @media (max-width: 480px) {
      font-size: 0.95rem;
    }
  }
`;

const Button = styled(motion.button)`
  background: #e50914;
  color: white;
  font-size: 1.2rem;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #ff1a25;
    transform: scale(1.05);
  }
`;

/* ================= COMPONENT ================= */

const AICustomDiet = () => {
  return (
    <Section
      variants={sectionAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Content variants={contentAnim}>
        <motion.h2 variants={textAnim}>
          AI-Powered Custom Diet Plan
        </motion.h2>

        <motion.p variants={textAnim}>
          Not sure what’s best for you? <br />
          Let YOG create a personalized meal plan based on your fitness goals!
        </motion.p>

        <Button
          variants={buttonAnim}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Let's Grind
        </Button>
      </Content>
    </Section>
  );
};

export default AICustomDiet;
