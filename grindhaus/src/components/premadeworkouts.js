// PreMadeWorkouts.js
import React, { useState } from "react";
import styled from "styled-components";
import beginnerswork from "../assets/workouts/beginners.png";
import intermediatework from "../assets/workouts/intermediate.png";
import advancework from "../assets/workouts/advance.png";

const Section = styled.section`
  background: #111;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.h2`
  background: black;
  width: 100%;
  text-align: center;
  color: white;
  margin-top: 0px;
  padding: 2rem 2rem;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 6px 500px rgba(252, 251, 251, 0.55);
  font-family: "Bangers", cursive;
`;

const CardGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 264px;
  height: 332px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
  }

  &:hover {
    transform: translateY(-5px);
  }

  &:hover::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const Popup = styled.div`
  background: rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 2rem;
  max-width: 700px;
  width: 90%;
  color: white;
  box-shadow: 0 8px 50px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PopupTitle = styled.h2`
  font-family: "Bangers", cursive;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const TabButton = styled.button.attrs(() => ({ type: "button" }))`
  background: ${(props) => (props.$active ? "#FF1A25" : "rgba(255,255,255,0.15)")};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#FF2A3B" : "rgba(255,255,255,0.35)")};
  }

  &:active {
    transform: scale(0.96);
  }

  box-shadow: ${(props) =>
    props.$active
      ? "0 0 15px rgba(255,26,37,0.75)"
      : "0 0 10px rgba(0,0,0,0.3)"};
`;

const RoutineBox = styled.div`
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 1.2rem;
  width: 100%;
  line-height: 1.6;
  font-size: 0.95rem;
  text-align: left;
`;

const CloseButton = styled.button`
  margin-top: 1.5rem;
  background: #ff4747;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: white;

  &:hover {
    background: #ff5c5c;
  }
`;

const PreMadeWorkouts = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDays, setSelectedDays] = useState(3);

  const programs = [
    { id: 1, name: "Beginner Foundation", img: beginnerswork },
    { id: 2, name: "Intermediate Strength Split", img: intermediatework },
    { id: 3, name: "Advanced Performance", img: advancework },
  ];

const routines = {
  Beginner: {
    3: [
      "Day 1: Full Body (Squat, Pushups, Rows) – Quads, Chest, Back",
      "Day 2: Rest or Cardio – Recovery, Endurance",
      "Day 3: Full Body (Lunges, Overhead Press, Pullups) – Glutes, Shoulders, Back"
    ],
    4: [
      "Day 1: Upper Body (Pushups, Rows, Plank) – Chest, Back, Core",
      "Day 2: Lower Body (Squats, Lunges, Calf Raises) – Quads, Glutes, Calves",
      "Day 3: Upper Body (Incline Pushups, Pullups) – Chest, Back",
      "Day 4: Cardio + Core – Abs, Endurance"
    ],
    5: [
      "Day 1: Chest & Arms – Chest, Biceps, Triceps",
      "Day 2: Back & Shoulders – Back, Shoulders",
      "Day 3: Legs – Quads, Hamstrings, Glutes",
      "Day 4: Core – Abs, Obliques",
      "Day 5: Active Recovery – Light Cardio, Stretching"
    ],
    6: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)",
      "Day 4: Push (Chest, Shoulders, Triceps)",
      "Day 5: Pull (Back, Biceps)",
      "Day 6: Legs (Quads, Hamstrings, Glutes)"
    ],
  },
  Intermediate: {
    3: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)"
    ],
    4: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)",
      "Day 4: Cardio + Core (Abs, Endurance)"
    ],
    5: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)",
      "Day 4: Upper Body (Chest, Back, Shoulders)",
      "Day 5: Lower Body (Legs, Glutes)"
    ],
    6: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)",
      "Day 4: Push (Chest, Shoulders, Triceps)",
      "Day 5: Pull (Back, Biceps)",
      "Day 6: Legs (Quads, Hamstrings, Glutes)"
    ],
  },
  Advanced: {
    3: [
      "Day 1: Full Body Compound (Squat, Deadlift, Bench Press) – Full Body Strength",
      "Day 2: Rest or Active Recovery",
      "Day 3: Full Body Compound (Overhead Press, Pullups, Lunges) – Full Body Strength"
    ],
    4: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)",
      "Day 4: Power Day (Olympic Lifts, Explosive Movements)"
    ],
    5: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)",
      "Day 4: Chest & Arms – Chest, Biceps, Triceps",
      "Day 5: Core & Conditioning – Abs, Obliques, Endurance"
    ],
    6: [
      "Day 1: Push (Chest, Shoulders, Triceps)",
      "Day 2: Pull (Back, Biceps)",
      "Day 3: Legs (Quads, Hamstrings, Glutes)",
      "Day 4: Push (Chest, Shoulders, Triceps)",
      "Day 5: Pull (Back, Biceps)",
      "Day 6: Legs (Quads, Hamstrings, Glutes)"
    ],
  },
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
    <Section>
      <Title>Pre-Made Workouts</Title>

      <CardGrid>
        {programs.map((program) => (
          <Card key={program.id} onClick={() => setSelectedProgram(program)}>
            <img src={program.img} alt={program.name} />
          </Card>
        ))}
      </CardGrid>

      {selectedProgram && (
        <PopupOverlay onClick={() => setSelectedProgram(null)}>
          <Popup onClick={(e) => e.stopPropagation()}>
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
    </Section>
  );
};

export default PreMadeWorkouts;
