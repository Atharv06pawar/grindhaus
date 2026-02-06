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

const Section = styled.section`
  background: #111;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// Inside your Card styled-component, add for desktop only:
const Card = styled(motion.div)`
  background: #222;
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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

  // Center last row items (9th & 10th)
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
  transition: all 0.3s ease;
  align-self: center;

  &:hover {
    background: #ff1a25;
    transform: scale(1.05);
  }
`;

const TargetedMuscles = () => {
  const [selected, setSelected] = useState(null);

  const muscles = [
    {
      name: "Chest",
      img: chest,
      distributions: {
    "Upper Chest": ["Incline Barbell Bench Press", "Incline Dumbbell Press", "Incline Dumbbell Fly", "Low-to-High Cable Fly", "Feet-Elevated Push-Ups", "Pike Push-Ups"],
    "Mid Chest": ["Flat Barbell Bench Press", "Flat Dumbbell Press", "Flat Dumbbell Fly", "Push-Ups"],
    "Lower Chest": ["Decline Barbell Bench Press", "Decline Dumbbell Press", "Decline Dumbbell Fly", "Decline Push-Ups"],
      },
    },
    {
      name: "Back",
      img: back,
      distributions: {
    "Upper Back": ["Pull-Ups / Chin-Ups", "Barbell Rows", "Dumbbell Rows", "Face Pulls", "Reverse Flys"],
    "Middle Back": ["Lat Pulldowns", "Seated Cable Rows", "T-Bar Rows", "Inverted Rows"],
    "Lower Back": ["Deadlifts", "Romanian Deadlifts", "Hyperextensions / Back Extensions", "Supermans", "Good Mornings", "Bridges / Glute-Ham Raises"]
},
    },
    {
      name: "Shoulders",
      img: shoulders,
      distributions: {
    "Front Shoulders": ["Overhead Barbell Press", "Dumbbell Shoulder Press", "Arnold Press", "Front Raises", "Pike Push-Ups"],
    "Side Shoulders": ["Dumbbell Lateral Raises", "Cable Lateral Raises", "Upright Rows"],
    "Rear Shoulders": ["Reverse Dumbbell Flys", "Face Pulls", "Rear Delt Machine Flys", "Bent-Over Dumbbell Reverse Flys"]
},
    },
    {
      name: "Biceps",
      img: biceps,
      distributions: {
    "Biceps": ["Barbell Curls", "Dumbbell Curls", "Hammer Curls", "Concentration Curls", "Preacher Curls", "Chin-Ups / Pull-Ups (underhand grip)", "Isometric Curl Holds (bodyweight alternative)"]
},
    },
    {
      name: "Triceps",
      img: triceps,
      distributions: {
        "Long Head": ["Overhead Dumbbell / Barbell Tricep Extension", "Skull Crushers / Lying Tricep Extension", "Overhead Cable Tricep Extension"],
        "Lateral Head": ["Tricep Pushdowns (Cable / Band)", "Close-Grip Bench Press", "Diamond Push-Ups", "Weighted / Bench Dips"],
        "Medial Head": ["Reverse-Grip Pushdowns (Cable / Band)", "Close-Grip Bench Press", "Bodyweight / Bench Dips", "Push-Ups (all types)"],
      },
    },
    {
      name: "Forearms",
      img: forearms,
      distributions: {
        "Flexors (inner forearm / palm side)": ["Wrist Curls (Barbell / Dumbbell)", "Reverse Grip Dumbbell Curls", "Hammer Curls"],
        "Extensors (outer forearm / back of hand)": ["Reverse Wrist Curls (Barbell / Dumbbell)", "Reverse Grip Barbell Curls"],
        "Brachioradialis (outer side, near elbow)": ["Hammer Curls", "Zottman Curls", "Reverse Grip Barbell Curls", "Chin-Ups / Pull-Ups (neutral grip)"],
      },
    },
    {
      name: "Core",
      img: core,
      distributions: {
        "Upper Abs": ["Crunches", "Sit-Ups", "Cable Crunches", "Incline Bench Crunches"],
        "Lower Abs": ["Leg Raises (Hanging or Lying)", "Reverse Crunches", "Flutter Kicks", "Hanging Knee Raises", "Plank Knee-to-Elbow"],
        "Obliques": ["Side Plank", "Russian Twists", "Bicycle Crunches", "Oblique V-Ups", "Cable Woodchoppers"],
        "Full Core / Stabilizers": ["Plank", "Front Plank with Arm/Leg Raises", "Mountain Climbers", "Dead Bug", "Ab Wheel Rollouts"],
      },
    },
    {
      name: "Legs",
      img: legs,
      distributions: {
         "Quads (front of thigh)": ["Barbell Squats", "Dumbbell Goblet Squats", "Leg Press", "Lunges", "Bulgarian Split Squats", "Step-Ups", "Bodyweight Squats / Jump Squats"],
        "Hamstrings (back of thigh)": ["Romanian Deadlifts", "Leg Curls (Machine or Band)", "Glute-Ham Raises", "Good Mornings", "Single-Leg Romanian Deadlifts", "Bridges / Hip Thrusts"],
        "Adductors (inner thigh)": ["Sumo Deadlifts", "Side Lunges", "Cossack Squats", "Adductor Machine"],
        "Abductors (outer thigh)": ["Lateral Band Walks", "Cable / Band Hip Abduction", "Side-Lying Leg Raises", "Clamshells"],
        "Calves": ["Standing Calf Raises (Barbell / Dumbbell)", "Seated Calf Raises", "Donkey Calf Raises", "Single-Leg Calf Raises", "Calf Raises on Stairs / Home Elevated Surface"],
      },
    },
    {
      name: "Glutes",
      img: glutes,
      distributions: {
        "Glute Maximus": ["Hip Thrust", "Glute Bridge"],
        "Glute Medius": ["Bulgarian Split Squat", "Side Leg Raise"],
        "Glute Minimus": ["Clamshells", "Fire Hydrants"],
        "Full Glute Activation": ["Squats", "Deadlifts", "Lunges"],
      },
    },
    {
      name: "Hip",
      img: hip,
      distributions: {
        "Hip Flexors": ["Lunge Stretch", "Leg Raises"],
        "Hip Abductors": ["Clamshells", "Hip Abduction"],
        "Hip Adductors": ["Side Lunges", "Hip Adduction"],
        "Hip Extensors": ["Glute Bridges", "Hip Thrusts"],
      },
    },
  ];

  return (
    <Section>
      <Grid>
        {muscles.map((muscle, index) => (
          <Card
            key={index}
            onClick={() => setSelected(muscle)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
      onClick={() => setSelected(null)} // <-- click outside triggers back
    >
      <GlassBox
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // <-- prevents closing when clicking inside box
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
        <BackButton onClick={() => setSelected(null)}>Back</BackButton>
      </GlassBox>
    </Overlay>
  )}
</AnimatePresence>

    </Section>
  );
};

export default TargetedMuscles;
