// WorkHero.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import menImg from "../assets/workouts/men.png";
import womenImg from "../assets/workouts/women.png";
import pushImg from "../assets/workouts/push.png";
import pullImg from "../assets/workouts/pull.png";
import legsImg from "../assets/workouts/legs.png";

// Main Section
const Section = styled.section`
  background: #111;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

// Row for Men/Women
const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  flex-wrap: nowrap;
`;

// Grid for Push/Pull/Legs
const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  flex-wrap: nowrap;
`;

// Card style for clickable images
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

// Square style for push/pull/legs
const Square = styled(Card)`
  max-width: 360px;
`;

// Glass overlay for expanded content
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

// Glass card for details
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

// Header inside glass box
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

// Scrollable content
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

  ul {
    list-style: none;
    padding-left: 0;
    li {
      padding: 0.4rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .suggestions {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.3);

    button {
      margin: 0.3rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      background: #e50914;
      color: white;
      font-weight: bold;
      transition: all 0.3s ease;

      &:hover {
        background: #ff1a25;
      }
    }
  }

  .routine-dropdown {
    margin-top: 1rem;
    select {
      width: 100%;
      padding: 0.5rem;
      border-radius: 6px;
      background: #222;
      color: white;
      border: 1px solid #444;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }
    button {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.5rem;
      background: #e50914;
      border: none;
      border-radius: 6px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background: #ff1a25;
      }
    }
  }
`;

// Back button
const BackButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  align-self: center;

  &:hover {
    background: #ff1a25;
    transform: scale(1.05);
  }
`;

const WorkHero = () => {
  const [selected, setSelected] = useState(null);
  const [currentGender, setCurrentGender] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState("");

  // Tabs with exercises
  const menTabs = [
    { name: "Workout for Men", img: menImg, exercises: ["Push-Ups", "Pull-Ups", "Squats", "Deadlifts", "Bench Press", "Overhead Press", "Bicep Curls", "Lunges", "Leg Press", "Plank"] },
    { name: "Push", img: pushImg, exercises: ["Bench Press", "Overhead Press", "Push-Ups", "Incline Dumbbell Press", "Chest Fly", "Dumbbell Shoulder Press"] },
    { name: "Pull", img: pullImg, exercises: ["Pull-Ups", "Barbell Rows", "Face Pulls", "Dumbbell Rows", "Chin-Ups", "Rear Delt Fly"] },
    { name: "Legs", img: legsImg, exercises: ["Squats", "Lunges", "Leg Press", "Romanian Deadlifts", "Leg Curl", "Calf Raises"] },
  ];

  const womenTabs = [
    { name: "Workout for Women", img: womenImg, exercises: ["Lunges", "Plank", "Hip Thrusts", "Dumbbell Curls", "Squats", "Deadlifts", "Glute Bridges", "Step-Ups", "Chest Press", "Overhead Press"] },
    { name: "Push", img: pushImg, exercises: ["Chest Press", "Overhead Press", "Push-Ups", "Incline Dumbbell Press", "Tricep Dips", "Chest Fly"] },
    { name: "Pull", img: pullImg, exercises: ["Resistance Rows", "Face Pulls", "Pull-Ups", "Dumbbell Rows", "Chin-Ups", "Rear Delt Fly"] },
    { name: "Legs", img: legsImg, exercises: ["Squats", "Step-Ups", "Glute Bridges", "Lunges", "Leg Press", "Calf Raises"] },
  ];

  const genderTabs = currentGender === "Men" ? menTabs : currentGender === "Women" ? womenTabs : null;

  // Group exercises by muscle
  const muscleGroups = {
    "Workout for Men": {
      Chest: ["Bench Press", "Push-Ups", "Incline Dumbbell Press", "Chest Fly"],
      Back: ["Pull-Ups", "Barbell Rows", "Dumbbell Rows", "Face Pulls", "Chin-Ups", "Rear Delt Fly"],
      Legs: ["Squats", "Lunges", "Leg Press", "Romanian Deadlifts", "Leg Curl", "Calf Raises"],
      Arms: ["Bicep Curls", "Tricep Extensions"],
      Core: ["Plank"]
    },
    "Workout for Women": {
      Chest: ["Chest Press", "Push-Ups", "Incline Dumbbell Press", "Chest Fly", "Overhead Press"],
      Back: ["Resistance Rows", "Face Pulls", "Pull-Ups", "Dumbbell Rows", "Chin-Ups", "Rear Delt Fly"],
      Legs: ["Squats", "Lunges", "Step-Ups", "Glute Bridges", "Leg Press", "Calf Raises"],
      Arms: ["Dumbbell Curls", "Tricep Dips"],
      Core: ["Plank", "Hip Thrusts"]
    },
    Push: {
      Chest: ["Bench Press", "Incline Dumbbell Press", "Push-Ups", "Chest Fly"],
      Shoulders: ["Overhead Press", "Dumbbell Shoulder Press"],
      Arms: ["Tricep Dips"]
    },
    Pull: {
      Back: ["Pull-Ups", "Barbell Rows", "Dumbbell Rows", "Face Pulls", "Resistance Rows"],
      Biceps: ["Bicep Curls", "Chin-Ups"],
      Rear: ["Rear Delt Fly"]
    },
    Legs: {
      Quads: ["Squats", "Leg Press", "Lunges", "Step-Ups"],
      Hamstrings: ["Romanian Deadlifts", "Leg Curl", "Glute Bridges"],
      Glutes: ["Hip Thrusts", "Lunges", "Glute Bridges"],
      Calves: ["Calf Raises"]
    }
  };

  // Popular routines for dropdown
  const popularRoutines = {
    Push: ["Chest + Triceps Focus", "Shoulders + Arms Focus", "Full Upper Body Push"],
    Pull: ["Back + Biceps Focus", "Rear Delts Focus", "Full Upper Body Pull"],
    Legs: ["Leg Strength Routine", "Glutes + Hamstrings Focus", "Full Leg Day"]
  };

  const handleAddToPlan = () => {
    if (selectedRoutine) alert(`${selectedRoutine} added to your plan!`);
  };

  return (
    <Section>
      {/* First row: Men/Women */}
      <Row>
        <Card onClick={() => { setCurrentGender("Men"); setSelected(menTabs[0]); }}>
          <img src={menImg} alt="Workout for Men" />
        </Card>
        <Card onClick={() => { setCurrentGender("Women"); setSelected(womenTabs[0]); }}>
          <img src={womenImg} alt="Workout for Women" />
        </Card>
      </Row>

      {/* Second row: Push/Pull/Legs always visible */}
      <Grid>
        {["Push", "Pull", "Legs"].map((type, i) => {
          const imgMap = { Push: pushImg, Pull: pullImg, Legs: legsImg };
          const selectedTab = genderTabs
            ? genderTabs.find(tab => tab.name === type)
            : { name: type, img: imgMap[type], exercises: [] };
          return (
            <Square key={i} onClick={() => { setSelected(selectedTab); setSelectedRoutine(""); }}>
              <img src={imgMap[type]} alt={type} />
            </Square>
          );
        })}
      </Grid>

      {/* Glass overlay for expanded content */}
      <AnimatePresence>
        {selected && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <GlassBox
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Header>
                <img src={selected.img} alt={selected.name} />
                <h2>{selected.name}</h2>
                <hr />
              </Header>

              <Content>
                <h3>Exercises:</h3>
                {Object.entries(muscleGroups[selected.name] || {}).map(([group, exercises]) => (
                  exercises.length > 0 && (
                    <div key={group} style={{ marginBottom: "1rem" }}>
                      <h4>{group}</h4>
                      <ul>
                        {exercises.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}

                {["Push", "Pull", "Legs"].includes(selected.name) && (
                  <div className="routine-dropdown">
                    <h4>Popular Routines:</h4>
                    <select
                      value={selectedRoutine}
                      onChange={(e) => setSelectedRoutine(e.target.value)}
                    >
                      <option value="">Select a routine</option>
                      {popularRoutines[selected.name].map((routine, i) => (
                        <option key={i} value={routine}>{routine}</option>
                      ))}
                    </select>
                    <button onClick={handleAddToPlan} disabled={!selectedRoutine}>
                      Add to My Plan
                    </button>
                  </div>
                )}

                {genderTabs && (
                  <div className="suggestions">
                    <h4>Try next:</h4>
                    {genderTabs
                      .filter((tab) => tab.name !== selected.name)
                      .map((tab, i) => (
                        <button key={i} onClick={() => { setSelected(tab); setSelectedRoutine(""); }}>
                          {tab.name}
                        </button>
                      ))}
                  </div>
                )}
              </Content>

              <BackButton onClick={() => setSelected(null)}>Back</BackButton>
            </GlassBox>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default WorkHero;
