import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import beginnerswork from "../assets/workouts/beginners.png";
import intermediatework from "../assets/workouts/intermediate.png";
import advancework from "../assets/workouts/advance.png";

/* ================= ANIMATION VARIANTS ================= */

const sectionAnim = {
  hidden: { opacity: 0, y: 80, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const titleAnim = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 }
  }
};

const gridAnim = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.25
    }
  }
};

const cardAnim = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const popupOverlayAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const popupAnim = {
  hidden: { scale: 0.85, opacity: 0, y: 40 },
  show: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: 30,
    transition: { duration: 0.25 }
  }
};

/* ================= STYLED COMPONENTS ================= */

const Section = styled(motion.section)`
  background: #111;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled(motion.h2)`
  background: black;
  width: 100%;
  text-align: center;
  color: white;
  padding: 2rem;
  font-size: 1.8rem;
  text-transform: uppercase;
  box-shadow: 0 6px 500px rgba(252, 251, 251, 0.55);
  font-family: "Bangers", cursive;
`;

const CardGrid = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Card = styled(motion.div)`
  width: 264px;
  height: 332px;
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: translateY(-6px);
  }

  &:hover::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const PopupOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Popup = styled(motion.div)`
  background: rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 2rem;
  max-width: 700px;
  width: 90%;
  color: white;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PopupTitle = styled.h2`
  font-family: "Bangers", cursive;
  margin-bottom: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const TabButton = styled.button`
  background: ${(p) => (p.$active ? "#FF1A25" : "rgba(255,255,255,0.15)")};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: ${(p) => (p.$active ? "#FF2A3B" : "rgba(255,255,255,0.35)")};
  }
`;

const RoutineBox = styled.div`
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 1.2rem;
  width: 100%;
`;

const CloseButton = styled.button`
  margin-top: 1.5rem;
  background: #ff4747;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  color: white;
  cursor: pointer;
`;

/* ================= COMPONENT ================= */

const PreMadeWorkouts = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDays, setSelectedDays] = useState(3);

  const programs = [
    { id: 1, name: "Beginner Foundation", img: beginnerswork },
    { id: 2, name: "Intermediate Strength Split", img: intermediatework },
    { id: 3, name: "Advanced Performance", img: advancework },
  ];

  const routines = {
    Beginner: { 3: ["Full Body Strength"], 4: ["Upper Lower"], 5: ["Bro Split"], 6: ["PPL x2"] },
    Intermediate: { 3: ["PPL"], 4: ["PPL + Core"], 5: ["Upper Lower + PPL"], 6: ["PPL x2"] },
    Advanced: { 3: ["Heavy Full Body"], 4: ["Power + PPL"], 5: ["Specialization Split"], 6: ["PPL x2 Intensity"] }
  };

  const getRoutine = () => {
    if (!selectedProgram) return [];
    const type = selectedProgram.name.includes("Beginner")
      ? "Beginner"
      : selectedProgram.name.includes("Intermediate")
      ? "Intermediate"
      : "Advanced";
    return routines[type][selectedDays] || [];
  };

  return (
    <Section
      variants={sectionAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
    >
      <Title variants={titleAnim}>
        Pre-Made Workouts
      </Title>

      <CardGrid variants={gridAnim}>
        {programs.map((program) => (
          <Card
            key={program.id}
            variants={cardAnim}
            whileHover={{ y: -10, scale: 1.03 }}
            onClick={() => setSelectedProgram(program)}
          >
            <img src={program.img} alt={program.name} />
          </Card>
        ))}
      </CardGrid>

      <AnimatePresence>
        {selectedProgram && (
          <PopupOverlay
            variants={popupOverlayAnim}
            initial="hidden"
            animate="show"
            exit="hidden"
            onClick={() => setSelectedProgram(null)}
          >
            <Popup
              variants={popupAnim}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <PopupTitle>{selectedProgram.name}</PopupTitle>

              <TabContainer>
                {[3, 4, 5, 6].map((day) => (
                  <TabButton
                    key={day}
                    $active={selectedDays === day}
                    onClick={() => setSelectedDays(day)}
                  >
                    {day} Days
                  </TabButton>
                ))}
              </TabContainer>

              <RoutineBox>
                {getRoutine().map((line, i) => (
                  <div key={i}>• {line}</div>
                ))}
              </RoutineBox>

              <CloseButton onClick={() => setSelectedProgram(null)}>
                Close
              </CloseButton>
            </Popup>
          </PopupOverlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default PreMadeWorkouts;
