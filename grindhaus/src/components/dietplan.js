// DietPlans.js
import React from "react";
import styled from "styled-components";

import muscleGain from "../assets/nutrition/musclegain.png";
import fatLoss from "../assets/nutrition/fatloss.png";
import performance from "../assets/nutrition/performance.png";
import healthyEating from "../assets/nutrition/healthy.png";

const Section = styled.section`
  background: #111;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 0.8rem; /* keep vertical spacing */
  column-gap: 0;   /* no column gap */
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

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  /* only affect 2nd column in each row */
  &:nth-child(even) {
    margin-left: -1rem; /* overlap horizontally */
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

const DietPlans = () => {
  const plans = [muscleGain, fatLoss, performance, healthyEating];

  return (
    <Section>
      <Title>Diet Plans Based on Goals</Title>
      <Grid>
        {plans.map((img, i) => (
          <Card key={i}>
            <img src={img} alt={`diet-plan-${i}`} />
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default DietPlans;
