import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import logo from '../assets/nav/logo.png';
import fbLogo from '../assets/footer/facebook.png';
import instaLogo from '../assets/footer/instagram.png';
import xLogo from '../assets/footer/x.png';

/* ===== Scroll Animation ===== */
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FooterContainer = styled.footer`
  background: #000000;
  color: white;
  padding: 1.5rem 2rem;
  font-family: "Times New Roman", Times, serif;
  display: flex;
  flex-direction: column;
  position: relative;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? fadeUp : "none")} 0.9s ease forwards;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const LogoRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const LogoImg = styled.img`
  height: 90px;
  width: auto;
  margin-right: 1.5rem;
`;

const Disclaimer = styled.p`
  font-size: 1rem;
  color: #c2bbbbff;
  line-height: 1.5;
  max-width: 700px;
  margin: 0;
`;

const CopyRight = styled.p`
  font-size: 0.9rem;
  color: #888;
  text-align: left;
  margin-top: 0.5rem;
`;

const SocialIcons = styled.div`
  position: absolute;
  right: 2rem;
  bottom: 1.5rem;
  display: flex;
  gap: 1rem;

  img {
    height: 28px;
    width: auto;
    cursor: pointer;
    transition: transform 0.3s ease, filter 0.3s ease;
    filter: drop-shadow(0 0 5px #ff003c) drop-shadow(0 0 8px #9b00ff);

    &:hover {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px #ff003c) drop-shadow(0 0 12px #9b00ff);
    }
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 1rem;
    justify-content: center;
  }
`;

const Footer = () => {
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
    <FooterContainer ref={ref} $visible={visible}>
      <TopSection>
        <LogoRow>
          <LogoImg src={logo} alt="GrindHaus Logo" />
          <Disclaimer>
            GrindHaus uses videos and form of the exercise from open source contents. 
            We are here only to create a good community.
          </Disclaimer>
        </LogoRow>

        <CopyRight>
          Copyrights © {new Date().getFullYear()} GrindHaus. All rights reserved.
        </CopyRight>
      </TopSection>

      <SocialIcons>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <img src={fbLogo} alt="Facebook" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <img src={instaLogo} alt="Instagram" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <img src={xLogo} alt="Twitter / X" />
        </a>
      </SocialIcons>
    </FooterContainer>
  );
};

export default Footer;
