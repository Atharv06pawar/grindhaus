// AICustomDiet.js
import React from "react";
import styled from "styled-components";

import aiDietBg from "../assets/nutrition/AIpowered.png"; // your exported background image

const Section = styled.section`
  background: url(${aiDietBg}) no-repeat center/cover;
  min-height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

const Content = styled.div`
  text-align: center;
  color: white;
  max-width: 700px;

  h2 {
    font-family: "Passero One", cursive;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
`;

const Button = styled.button`
  background: #e50914; /* same as navbar button */
  color: white;
  font-size: 1.2rem;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #ff1a25;
    transform: scale(1.05);
  }
`;

const AICustomDiet = () => {
  return (
    <Section>
      <Content>
        <h2>AI-Powered Custom Diet Plan</h2>
        <p>
          Not sure what’s best for you? <br /> Let YOG create a personalized meal
          plan based on your fitness goals!
        </p>
        <Button>Let's Grind</Button>
      </Content>
    </Section>
  );
};

export default AICustomDiet;