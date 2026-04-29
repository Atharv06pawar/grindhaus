// Hero.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import heroBg from '../assets/home/hero.png';

// Gradient animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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

  background-image: url(${heroBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  padding-bottom: 10px;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? fadeUp : 'none')} 0.9s ease forwards;
`;

const HeroTitle = styled.h1`
  font-family: 'Stardos Stencil', sans-serif;
  font-weight: 400;
  font-size: 48px;
  line-height: 150%;
  letter-spacing: 0.09em;
  margin-bottom: 1rem;
  text-align: left;
  filter: url(#roughen);

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
  font-weight: bold;
  background: linear-gradient(270deg, #ff003c, #8a2be2);
  background-size: 400% 400%;
  animation: ${gradientShift} 4s ease infinite;
  box-shadow: 0 0 10px #ff003c, 0 0 20px #8a2be2;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover {
    animation: none;
    background: #ff003c;
    box-shadow: 0 0 20px #ff003c, 0 0 40px #ff003c;
  }
`;

const Hero = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <HeroContainer ref={ref}>
      <RoughenFilter />
      <HeroContent $visible={visible}>
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
