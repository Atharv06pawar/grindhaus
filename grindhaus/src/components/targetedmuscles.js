// TargetedMuscles.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import chest from "../assets/technique/chest.png";
import back from "../assets/technique/back.png";
import shoulders from "../assets/technique/shoulders.png";
import biceps from "../assets/technique/biceps.png";
import triceps from "../assets/technique/triceps.png";
import forearms from "../assets/technique/forearms.png";
import core from "../assets/technique/core.png";
import legs from "../assets/technique/legs.png";
import glutes from "../assets/technique/glutes.png";
import hip from "../assets/technique/hip.png";

/* ================= SCROLL ANIMATIONS ================= */

const sectionAnim = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08
    }
  }
};

const cardAnim = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/* ================= STYLED ================= */

const Section = styled(motion.section)`
  background: #111;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Grid = styled(motion.div)`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: #222;
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  max-width: 240px;
  box-shadow: 0 4px 250px #bc8894;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 1025px) {
    &:nth-child(9) {
      grid-column: 2 / 3;
    }
    &:nth-child(10) {
      grid-column: 3 / 4;
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const GlassBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  color: white;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;

  img {
    width: 150px;
    max-width: 200px;
    margin-bottom: 1rem;
  }

  h2 {
    font-family: "Passero One", cursive;
    font-size: 2rem;
    margin: 0;
  }

  hr {
    width: 80%;
    margin: 1rem 0;
    border: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 10px;
  }

  .distribution {
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      text-decoration: underline;
    }

    ul {
      list-style: none;
      padding-left: 0;
      li {
        padding: 0.4rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }
  }
`;

const BackButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #ff1a25;
    transform: scale(1.05);
  }
`;

/* ================= COMPONENT ================= */

const TargetedMuscles = () => {
  const [selected, setSelected] = useState(null);

  const muscles = [
    { name: "Chest", img: chest, distributions: { "Upper Chest": ["Incline Bench", "Incline DB Press"] } },
    { name: "Back", img: back, distributions: { "Upper Back": ["Pull Ups", "Rows"] } },
    { name: "Shoulders", img: shoulders, distributions: { "Front": ["OHP", "Front Raise"] } },
    { name: "Biceps", img: biceps, distributions: { "Biceps": ["Barbell Curl", "Hammer Curl"] } },
    { name: "Triceps", img: triceps, distributions: { "Long Head": ["Skull Crushers"] } },
    { name: "Forearms", img: forearms, distributions: { "Flexors": ["Wrist Curl"] } },
    { name: "Core", img: core, distributions: { "Abs": ["Crunch", "Leg Raise"] } },
    { name: "Legs", img: legs, distributions: { "Quads": ["Squat", "Leg Press"] } },
    { name: "Glutes", img: glutes, distributions: { "Glutes": ["Hip Thrust"] } },
    { name: "Hip", img: hip, distributions: { "Hip Flexor": ["Leg Raise"] } }
  ];

  return (
    <Section
      variants={sectionAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <Grid>
        {muscles.map((muscle, index) => (
          <Card
            key={index}
            variants={cardAnim}
            onClick={() => setSelected(muscle)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <img src={muscle.img} alt={muscle.name} />
          </Card>
        ))}
      </Grid>

      <AnimatePresence>
        {selected && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <GlassBox
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Header>
                <img src={selected.img} alt={selected.name} />
                <h2>{selected.name}</h2>
                <hr />
              </Header>

              <Content>
                {Object.entries(selected.distributions).map(([dist, exercises], i) => (
                  <div className="distribution" key={i}>
                    <h3>{dist}</h3>
                    <ul>
                      {exercises.map((ex, j) => (
                        <li key={j}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Content>

              <BackButton onClick={() => setSelected(null)}>
                Back
              </BackButton>
            </GlassBox>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default TargetedMuscles;
