// LastSection.js
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import backgroundImg from "../assets/home/last.png";

/* ===== Scroll Animations ===== */
const fadeScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92) translateY(40px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const Section = styled.section`
  background: url(${backgroundImg}) center/cover no-repeat;
  color: white;
  text-align: center;
  padding: 8rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? fadeScale : "none")} 1s ease forwards;
`;

const QuoteWrapper = styled.div`
  display: inline-block;
  margin-bottom: 2rem;
  font-family: 'Bangers', 'Passero One', Impact, sans-serif;
  font-weight: 600;
  font-size: 65px;
  line-height: 75px;
  letter-spacing: 0;
  text-align: center;

  color: transparent;
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  &:before {
    content: "Crush Your Fitness Goals";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: transparent;
    background: white;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: blur(4px);
    opacity: 0.6;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    font-size: 40px;
    line-height: 48px;
  }
`;

const Button = styled.button`
  background: linear-gradient(270deg, #ff003c, #3a2be2ff);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.55);
  transition: all 0.3s ease;

  &:hover {
    background: #ff003c;
    box-shadow: 0 0 20px #ff003c, 0 0 40px #ff003c;
  }
`;

const LastSection = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Section ref={ref} $visible={visible}>
      <QuoteWrapper>
        Crush Your Fitness <br /> Goals
      </QuoteWrapper>

      <Button>Register Now</Button>
    </Section>
  );
};

export default LastSection;
