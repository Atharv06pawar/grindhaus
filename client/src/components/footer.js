import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import BrandWordmark from "./BrandWordmark";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FooterContainer = styled.footer`
  position: relative;
  overflow: hidden;
  background: #0b0b0b;
  color: #f5f5f5;
  padding: clamp(3rem, 7vw, 5rem) 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? fadeUp : "none")} 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 0%, rgba(255, 69, 58, 0.12), transparent 34%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
    pointer-events: none;
  }
`;

const FooterInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 1120px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.35rem;
`;

const FooterTagline = styled.p`
  margin: 0;
  color: rgba(245, 245, 245, 0.7);
  font-size: clamp(1rem, 1.7vw, 1.2rem);
  letter-spacing: 0.02em;
`;

const FooterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem 1.35rem;
  margin-top: 0.4rem;
`;

const FooterLink = styled(Link)`
  color: rgba(245, 245, 245, 0.62);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.25s ease, text-shadow 0.25s ease;

  &:hover,
  &:focus-visible {
    color: #f5f5f5;
    text-shadow: 0 0 16px rgba(255, 69, 58, 0.24);
  }
`;

const FooterDivider = styled.div`
  width: min(100%, 560px);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent);
  margin: 0.65rem 0 0.15rem;
`;

const CopyRight = styled.p`
  margin: 0;
  color: rgba(245, 245, 245, 0.42);
  font-size: 0.86rem;
`;

const Footer = () => {
  const ref = useRef(null);
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
    <FooterContainer ref={ref} $visible={visible}>
      <FooterInner>
        <BrandWordmark size="md" />
        <FooterTagline>AI-Powered Human Performance Ecosystem</FooterTagline>

        <FooterNav aria-label="Footer navigation">
          <FooterLink to="/">Vision</FooterLink>
          <FooterLink to="/technique">Technology</FooterLink>
          <FooterLink to="/community">Community</FooterLink>
          <FooterLink as="a" href="mailto:redaesth.team@gmail.com">Contact</FooterLink>
        </FooterNav>

        <FooterDivider />
        <CopyRight>Copyright &copy; {new Date().getFullYear()} REDAESTH. All rights reserved.</CopyRight>
      </FooterInner>
    </FooterContainer>
  );
};

export default React.memo(Footer);
