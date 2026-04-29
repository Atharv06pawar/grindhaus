import React, { memo } from "react";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import logo from "../assets/nav/logo.png";

export const LOADER_BREATH_DURATION_MS = 1600;
export const INITIAL_LOADER_DURATION_MS = LOADER_BREATH_DURATION_MS;
export const ROUTE_LOADER_DURATION_MS = LOADER_BREATH_DURATION_MS / 2;
export const LOADER_FADE_DURATION_MS = 0.22;

const breathe = keyframes`
  0% { transform: scale(0.94); opacity: 0.72; }
  50% { transform: scale(1.04); opacity: 1; }
  100% { transform: scale(0.94); opacity: 0.72; }
`;

const LoaderWrapper = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Logo = styled.img`
  width: clamp(128px, 15vw, 160px);
  animation: ${breathe} ${LOADER_BREATH_DURATION_MS}ms ease-in-out infinite;
  will-change: transform, opacity;
`;

const loaderVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: LOADER_FADE_DURATION_MS,
      ease: [0.4, 0, 1, 1]
    }
  }
};

const GlobalLoader = ({ label = "Loading GrindHaus" }) => {
  return (
    <LoaderWrapper
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={loaderVariants}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Logo src={logo} alt="GrindHaus Loading" />
    </LoaderWrapper>
  );
};

export default memo(GlobalLoader);
