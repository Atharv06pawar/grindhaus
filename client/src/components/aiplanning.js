import React from "react";
import styled from "styled-components";
import backgroundImg from "../assets/workouts/aiplan.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= ANIMATION VARIANTS ================= */

const sectionAnim = {
  hidden: { opacity: 0, scale: 1.05 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const titleAnim = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const subtitleAnim = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.35
    }
  }
};

const buttonAnim = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.5
    }
  }
};

/* ================= STYLED COMPONENTS ================= */

const Section = styled(motion.section)`
  background: url(${backgroundImg}) center/cover no-repeat;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled(motion.h2)`
  font-family: "Bangers", cursive;
  font-size: 3rem;
  color: white;
  margin-bottom: 0.1rem;

  text-shadow: 
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,   
    1px 1px 0 #000,
    -2px -2px 0 #000,  
    2px -2px 0 #000,
    -2px 2px 0 #000,   
    2px 2px 0 #000;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: "Open Sans", sans-serif;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 0.5rem;
  max-width: 600px;

  text-shadow: 
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,   
    1px 1px 0 #000;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled(motion(Link))`
  background: linear-gradient(270deg, #ff003c, #8a2be2);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  font-weight: bold;
  text-decoration: none;
  font-size: 1rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &:hover {
    background: #ff003c;
    box-shadow: 0 0 20px #ff003c, 0 0 40px #ff003c;
  }
`;

/* ================= COMPONENT ================= */

const AIPlanning = () => {
  return (
    <Section
      variants={sectionAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
    >
      <Title variants={titleAnim}>
        AI PLANNING
      </Title>

      <Subtitle variants={subtitleAnim}>
        Use our AI to help achieve <br /> your desired body.
      </Subtitle>

      <Button
        to="/signup"
        variants={buttonAnim}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Register Now
      </Button>
    </Section>
  );
};

export default AIPlanning;
