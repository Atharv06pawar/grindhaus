// QuoteRibbon.js
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

/* ===== Scroll Animation ===== */
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

const Ribbon = styled.section`
  background: #ffffff;
  height: 180px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? fadeUp : "none")} 0.9s ease forwards;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 2rem 1rem;
    text-align: center;
    gap: 1rem;
  }
`;

const LeftText = styled.div`
  flex: 1;
  font-family: 'Bangers', 'Passero One', Impact, sans-serif;
  font-size: 52px;
  font-weight: 400;
  line-height: 1.3;
  color: #000000;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const RightText = styled.div`
  flex: 1;
  font-family: 'Bangers', 'Passero One', Impact, sans-serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.5;
  color: #000000;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const QuoteRibbon = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Ribbon ref={ref} $visible={visible}>
      <LeftText>{"Don't Just Dream It Do\nIt."}</LeftText>

      <RightText>
        {
          "take your first step towards a healthier \nlifestyle and sign up for free membership.\nLimited time offer!!"
        }
      </RightText>
    </Ribbon>
  );
};

export default QuoteRibbon;
