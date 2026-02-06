// Macronutrients.js
import React from "react";
import styled from "styled-components";
import "@fontsource/passero-one"; // ✅ Add this import

import protein from "../assets/nutrition/protein.png";
import carbs from "../assets/nutrition/carbs.png";
import fats from "../assets/nutrition/fats.png";
import fiber from "../assets/nutrition/fiber.png";

const Section = styled.section`
  background: #111;
  padding: 5px 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  background: black;
  width: 100%;
  color: white;
  font-family: "Passero One", cursive; /* ✅ Updated font */
  font-size: 2.5rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
  z-index: 1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
`;

const Card = styled.div`
  background: #222;
  overflow: hidden;
  width: 100%;
  max-width: 380px;
  min-height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 250px #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0px 500px rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 769px) {
    border-radius: 100px;

    &:nth-child(1) {
      border-bottom-right-radius: 0;
    }
    &:nth-child(2) {
      border-bottom-left-radius: 0;
    }
    &:nth-child(3) {
      border-top-right-radius: 0;
    }
    &:nth-child(4) {
      border-top-left-radius: 0;
    }
  }

  @media (max-width: 768px) {
    max-width: 160px;
    min-height: 160px;
    border-radius: 30px;

    &:nth-child(1) {
      border-bottom-right-radius: 0;
    }
    &:nth-child(2) {
      border-bottom-left-radius: 0;
    }
    &:nth-child(3) {
      border-top-right-radius: 0;
    }
    &:nth-child(4) {
      border-top-left-radius: 0;
    }
  }
`;

const Macronutrients = () => {
  const macros = [
    { name: "Protein", img: protein },
    { name: "Carbs", img: carbs },
    { name: "Fats", img: fats },
    { name: "Fiber", img: fiber },
  ];

  return (
    <Section>
      <Title>Macronutrients Breakdown</Title>
      <Grid>
        {macros.map((macro, i) => (
          <Card key={i}>
            <img src={macro.img} alt={macro.name} />
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default Macronutrients;
