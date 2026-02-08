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
  padding: 4rem 2rem;
  padding-top: 50px;
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
    flex-direction: column;
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
    align-items: center;
  }
`;

/* ================= CARD ================= */

const Card = styled(motion.div)`
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

  img {
    width: 150px;
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
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;

  p {
    opacity: 0.9;
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

  &:hover {
    background: #ff1a25;
  }
`;

/* ================= COMPONENT ================= */

const WorkHero = () => {
  const [selected, setSelected] = useState(null);

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
          onClick={() => setSelected({ name: "Workout for Men", img: menImg })}
        >
          <img src={menImg} alt="Men" />
        </Card>

        <Card
          variants={cardReveal}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelected({ name: "Workout for Women", img: womenImg })}
        >
          <img src={womenImg} alt="Women" />
        </Card>
      </Row>

      {/* PUSH PULL LEGS */}
      <Grid variants={sectionReveal}>
        {[
          { name: "Push", img: pushImg },
          { name: "Pull", img: pullImg },
          { name: "Legs", img: legsImg }
        ].map((item, i) => (
          <Square
            key={i}
            variants={cardReveal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(item)}
          >
            <img src={item.img} alt={item.name} />
          </Square>
        ))}
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
              onClick={(e) => e.stopPropagation()}
            >
              <Header>
                <img src={selected.img} alt={selected.name} />
                <h2>{selected.name}</h2>
                <hr />
              </Header>

              <Content>
                <p>Workout content coming soon...</p>
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
