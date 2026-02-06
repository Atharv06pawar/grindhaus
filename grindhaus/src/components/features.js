// Features.js
import React from "react";
import styled from "styled-components";

// Import your custom icons
import aiIcon from "../assets/home/ai.png";
import trackerIcon from "../assets/home/tracker.png";
import libraryIcon from "../assets/home/library.png";

const Section = styled.section`
  background: #111111;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  color: white;
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }
`;

const Title = styled.h3`
  font-family: "Bangers", cursive; /* Use Bangers font */
  font-size: 1.8rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #cccccc;
  font-family: "Bangers", cursive;
`;

const Features = () => {
  return (
    <Section>
      <CardsWrapper>
        <Card>
          <IconWrapper>
            <img src={aiIcon} alt="AI Coach" />
          </IconWrapper>
          <Title>Personal AI Coach</Title>
          <Description>
            Get personalized workout <br /> plans and meal <br /> suggestions
            based on your <br /> body type and goals
          </Description>
        </Card>

        <Card>
          <IconWrapper>
            <img src={trackerIcon} alt="Progress Tracker" />
          </IconWrapper>
          <Title>Progress Tracker</Title>
          <Description>
            Track your workouts, set <br /> goals, and analyze your <br />{" "}
            progress with detailed <br /> stats.
          </Description>
        </Card>

        <Card>
          <IconWrapper>
            <img src={libraryIcon} alt="Workout Library" />
          </IconWrapper>
          <Title>Workout Library</Title>
          <Description>
            Browse a comprehensive <br /> library of exercises <br /> with proper
            form videos and <br /> tips.
          </Description>
        </Card>
      </CardsWrapper>
    </Section>
  );
};

export default Features;
