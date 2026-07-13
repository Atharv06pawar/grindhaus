// Features.js
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// Icons
import aiIcon from "../assets/home/ai.png";
import trackerIcon from "../assets/home/tracker.png";
import libraryIcon from "../assets/home/library.png";

/* ===== Scroll Animations ===== */
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

/* Scroll Animated Card */
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

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? fadeUp : "none")} 0.8s ease forwards;

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
  font-family: "Bangers", "Passero One", Impact, sans-serif;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #cccccc;
`;

/* Single Card Observer Hook */
const FeatureCard = ({ icon, title, desc, delay = 0 }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Card
      ref={ref}
      $visible={visible}
      style={{ animationDelay: `${delay}s` }}
    >
      <IconWrapper>
        <img src={icon} alt={title} />
      </IconWrapper>
      <Title>{title}</Title>
      <Description>{desc}</Description>
    </Card>
  );
};

const Features = () => {
  return (
    <Section>
      <CardsWrapper>
        <FeatureCard
          icon={aiIcon}
          title="Personal AI Coach"
          desc={
            <>
              Get personalized workout <br /> plans and meal <br /> suggestions
              based on your <br /> body type and goals
            </>
          }
          delay={0}
        />

        <FeatureCard
          icon={trackerIcon}
          title="Progress Tracker"
          desc={
            <>
              Track your workouts, set <br /> goals, and analyze your <br />
              progress with detailed <br /> stats.
            </>
          }
          delay={0.15}
        />

        <FeatureCard
          icon={libraryIcon}
          title="Workout Library"
          desc={
            <>
              Browse a comprehensive <br /> library of exercises <br /> with proper
              form videos and <br /> tips.
            </>
          }
          delay={0.3}
        />
      </CardsWrapper>
    </Section>
  );
};

export default Features;
