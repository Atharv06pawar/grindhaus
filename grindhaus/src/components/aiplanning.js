// AIPlanning.js
import React from "react";
import styled from "styled-components";
import backgroundImg from "../assets/workouts/aiplan.png"; // replace with your bg image path
import { Link } from "react-router-dom";

// Section background
const Section = styled.section`
  background: url(${backgroundImg}) center/cover no-repeat;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

// Title with double border
const Title = styled.h2`
  font-family: "Bangers", cursive;
  font-size: 3rem;
  color: white;
  margin-bottom: 0.1rem;

  /* Double border effect */
  text-shadow: 
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,   
    1px 1px 0 #000,
    -2px -2px 0 #000,  
    2px -2px 0 #000,
    -2px 2px 0 #000,   
    2px 2px 0 #000;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

// Subtitle with single border
const Subtitle = styled.p`
  font-family: "Open Sans", sans-serif;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 0.5rem;
  max-width: 600px;

  /* Single border effect */
  text-shadow: 
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,   
    1px 1px 0 #000;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Button (same as homepage)
const Button = styled(Link)`
  background: linear-gradient(270deg, #ff003c, #8a2be2);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  font-weight: bold;
  text-decoration: none;
  font-size: 1rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &:hover {
    background: #ff003c;
    box-shadow: 0 0 20px #ff003c, 0 0 40px #ff003c;
  }
`;

const AIPlanning = () => {
  return (
    <Section>
      <Title>AI PLANNING</Title>
      <Subtitle>
        Use our AI to help achieve <br/>your desired body.
      </Subtitle>
      <Button to="/signup">Register Now</Button>
    </Section>
  );
};

export default AIPlanning;
