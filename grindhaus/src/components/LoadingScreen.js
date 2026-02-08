import React from "react";
import styled, { keyframes } from "styled-components";
import logo from "../assets/nav/logo.png";

/* Soft breathing animation */
const breathe = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(5); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  background: #0b0b0b;

  display: flex;
  align-items: center;
  justify-content: center;

  /* Equal spacing from all sides */
  padding: 10px 10px 10px 10px;

  z-index: 9999;
`;

const Logo = styled.img`
  /* Fit inside available space */
  max-width: 100%;
  max-height: 100%;

  /* Maintain ratio */
  object-fit: contain;

  animation: ${breathe} 3s ease-in-out infinite;

  filter: drop-shadow(0 0 22px rgba(229, 9, 20, 0.35));
`;

export default function LoadingScreen() {
  return (
    <Wrapper>
      <Logo src={logo} alt="GrindHaus Loading" />
    </Wrapper>
  );
}
