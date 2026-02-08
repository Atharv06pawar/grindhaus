// WorkHero.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import menImg from "../assets/workouts/men.png";
import womenImg from "../assets/workouts/women.png";
import pushImg from "../assets/workouts/push.png";
import pullImg from "../assets/workouts/pull.png";
import legsImg from "../assets/workouts/legs.png";

/* ================= ANIMATION VARIANTS ================= */

const sectionReveal = {
  hidden: { opacity: 0, y: 80 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.12
    }
  }
};

const cardReveal = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

/* ================= MAIN SECTION ================= */

const Section = styled(motion.section)`
  background: #111;
  padding-top:50px;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

/* ================= MEN / WOMEN ROW ================= */

const Row = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column; /* 1 */
  }
`;


/* ================= PUSH PULL LEGS GRID ================= */

const Grid = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;   /* ⭐ center horizontally */
  }
`;


/* ================= CARD ================= */

const Card = styled(motion.a)`
  flex: 1;
  max-width: 560px;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    border-radius: 30px;
    box-shadow: 15px 12px 50px rgba(67, 15, 7, 1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  &:hover img {
    transform: translateY(-6px);
    box-shadow: 12px 15px 50px rgba(255, 255, 255, 0.8);
  }
`;

/* ================= SQUARE ================= */

const Square = styled(Card)`
  max-width: 360px;
`;

/* ================= OVERLAY ================= */

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

/* ================= GLASS BOX ================= */

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

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  }
`;

/* ================= COMPONENT ================= */

const WorkHero = () => {
  const [selected, setSelected] = useState(null);
  const [currentGender, setCurrentGender] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState("");

  const menTabs = [
    { name: "Workout for Men", img: menImg },
    { name: "Push", img: pushImg },
    { name: "Pull", img: pullImg },
    { name: "Legs", img: legsImg }
  ];

  const womenTabs = [
    { name: "Workout for Women", img: womenImg },
    { name: "Push", img: pushImg },
    { name: "Pull", img: pullImg },
    { name: "Legs", img: legsImg }
  ];

  const genderTabs =
    currentGender === "Men"
      ? menTabs
      : currentGender === "Women"
      ? womenTabs
      : null;

  return (
    <Section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* MEN WOMEN */}
      <Row variants={sectionReveal}>
        <Card
          variants={cardReveal}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setCurrentGender("Men");
            setSelected(menTabs[0]);
          }}
        >
          <img src={menImg} alt="Men" />
        </Card>

        <Card
          variants={cardReveal}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setCurrentGender("Women");
            setSelected(womenTabs[0]);
          }}
        >
          <img src={womenImg} alt="Women" />
        </Card>
      </Row>

      {/* PUSH PULL LEGS */}
      <Grid variants={sectionReveal}>
        {["Push", "Pull", "Legs"].map((type, i) => {
          const imgMap = { Push: pushImg, Pull: pullImg, Legs: legsImg };

          return (
            <Square
              key={i}
              variants={cardReveal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setSelected({ name: type, img: imgMap[type] })
              }
            >
              <img src={imgMap[type]} alt={type} />
            </Square>
          );
        })}
      </Grid>

      {/* OVERLAY */}
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
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Header>
                <img src={selected.img} alt={selected.name} />
                <h2>{selected.name}</h2>
                <hr />
              </Header>

              <Content>
                <p>Workout content here...</p>
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

export default WorkHero;
