import React from "react";
import styled, { keyframes } from "styled-components";
import logo from "../assets/nav/logo.png";

/* Breathing Animation */
const breathe = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Logo = styled.img`
  width: 160px;
  animation: ${breathe} 2.2s ease-in-out infinite;
`;

const GlobalLoader = () => {
  return (
    <LoaderWrapper>
      <Logo src={logo} alt="GrindHaus Loading" />
    </LoaderWrapper>
  );
};

export default GlobalLoader;
