// Hero.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import heroBg from '../assets/home/hero.png'; // adjust the file name

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const RoughenFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <filter id="roughen">
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="0.6" 
        numOctaves="1" 
        result="noise" 
      />
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="noise" 
        scale="10" 
      />
    </filter>
  </svg>
);

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: left;
  color: white;

  /* Background Image */
  background-image: url(${heroBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* Overlay for text readability */
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5); /* dark overlay */
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1; /* ensures content is above the overlay */
`;

const HeroTitle = styled.h1`
  font-family: 'Stardos Stencil', sans-serif; /* stencil font */
  font-weight: 400;
  font-style: normal;
  font-size: 48px;
  line-height: 150%;
  letter-spacing: 0.09em;
  margin-bottom: 1rem;
  text-align: left;
  filter: url(#roughen); /* apply rough effect */

  @media (max-width: 768px) {
    font-size: 32px;
    letter-spacing: 0.05em;
    line-height: 1.4;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px){
    font-size: 15px;
  }
`;

const HeroButton = styled.button`
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  background: linear-gradient(270deg, #ff003c, #8a2be2);
  background-size: 400% 400%;
  animation: ${gradientShift} 4s ease infinite;
  box-shadow: 0 0 10px #ff003c, 0 0 20px #8a2be2;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  &:hover {
    animation: none;
    background: #ff003c;
    box-shadow: 0 0 20px #ff003c, 0 0 40px #ff003c;
  }
`;

const Hero = () => {
  return (
    <HeroContainer>
      <RoughenFilter />
      <HeroContent>
        <HeroTitle>
          EAT, SLEEP,<br/>GRIND, REPEAT.
        </HeroTitle>
        <HeroSubtitle>
          the only fitness companion you'd ever require
        </HeroSubtitle>
        <HeroButton>Register Now</HeroButton>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
