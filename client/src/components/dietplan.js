// DietPlans.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import muscleGain from "../assets/nutrition/musclegain.png";
import fatLoss from "../assets/nutrition/fatloss.png";
import performance from "../assets/nutrition/performance.png";
import healthyEating from "../assets/nutrition/healthy.png";

/* ================= SCROLL ANIMATIONS ================= */

const sectionAnim = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.12
    }
  }
};

const titleAnim = {
  hidden: { opacity: 0, y: -40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const gridAnim = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  }
};

const cardAnim = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: "easeOut"
    }
  }
};

/* ================= STYLED ================= */

const Section = styled(motion.section)`
  background: #111;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h2)`
  background: white;
  width: 100%;
  color: black;
  font-family: "Passero One", cursive;
  font-size: 2rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 2px 10px 5px rgba(0, 0, 0, 0.2);
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 0.8rem;
  column-gap: 0;
  width: 100%;
  max-width: 1100px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 0.5rem;
  }
`;

const Card = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;

  &:nth-child(even) {
    margin-left: -1rem;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    filter: drop-shadow(0 10px 250px rgba(252, 250, 250, 0.4));
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
  }

  img:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.5));
  }
`;

/* ================= COMPONENT ================= */

const DietPlans = () => {
  const plans = [muscleGain, fatLoss, performance, healthyEating];

  return (
    <Section
      variants={sectionAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Title variants={titleAnim}>
        Diet Plans Based on Goals
      </Title>

      <Grid variants={gridAnim}>
        {plans.map((img, i) => (
          <Card
            key={i}
            variants={cardAnim}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <img src={img} alt={`diet-plan-${i}`} />
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default DietPlans;
