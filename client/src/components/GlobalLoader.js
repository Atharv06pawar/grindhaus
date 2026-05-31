import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

import BrandWordmark from "./BrandWordmark";

export const INITIAL_LOADER_DURATION_MS = 3400;
export const ROUTE_LOADER_DURATION_MS = 1900;
export const LOADER_FADE_DURATION_MS = 0.58;

const ACCENT_RED = "#FF453A";
const cinematicEase = [0.22, 1, 0.36, 1];

const idleBreath = keyframes`
  0% {
    opacity: 0.82;
    transform: scale(0.992);
    text-shadow: 0 0 10px rgba(255, 69, 58, 0.1);
  }
  50% {
    opacity: 1;
    transform: scale(1.008);
    text-shadow: 0 0 24px rgba(255, 69, 58, 0.22);
  }
  100% {
    opacity: 0.82;
    transform: scale(0.992);
    text-shadow: 0 0 10px rgba(255, 69, 58, 0.1);
  }
`;

const LoaderWrapper = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #090909;
  isolation: isolate;
`;

const AmbientGlow = styled(motion.div)`
  position: absolute;
  inset: auto auto 50% 50%;
  width: min(68vw, 760px);
  height: min(68vw, 760px);
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 69, 58, 0.16), transparent 58%),
    radial-gradient(circle, rgba(245, 245, 245, 0.05), transparent 72%);
  transform: translate(-50%, 50%);
  filter: blur(18px);
  opacity: 0.64;
  pointer-events: none;
  z-index: -1;
`;

const FineVignette = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.18) 52%, rgba(0, 0, 0, 0.7) 100%),
    linear-gradient(180deg, rgba(255, 69, 58, 0.08), transparent 18%, transparent 82%, rgba(255, 69, 58, 0.06));
  pointer-events: none;
`;

const LogoStage = styled.div`
  position: relative;
  width: min(82vw, 920px);
  height: clamp(210px, 26vw, 320px);
  display: grid;
  place-items: center;
  font-family: "Bricolage Grotesque", sans-serif;
  color: #f5f5f5;
`;

const Glyph = styled(motion.span)`
  position: absolute;
  font-size: clamp(4.7rem, 13vw, 11rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.04em;
  will-change: transform, opacity, filter;
`;

const Slash = styled(motion.span)`
  position: absolute;
  color: ${ACCENT_RED};
  font-size: clamp(4.8rem, 12vw, 9rem);
  font-weight: 300;
  line-height: 1;
  transform-origin: center;
  will-change: transform, opacity;
`;

const Segment = styled(motion.span)`
  position: absolute;
  font-size: clamp(2.65rem, 8.5vw, 7.4rem);
  font-weight: 700;
  line-height: 1;
  color: #f5f5f5;
  letter-spacing: 0.2em;
  will-change: transform, opacity, letter-spacing;
`;

const FinalLogoWrap = styled(motion.div)`
  position: absolute;
  display: grid;
  place-items: center;
  will-change: transform, opacity;
`;

const FinalWordmark = styled(BrandWordmark)`
  animation: ${idleBreath} 2.6s ease-in-out infinite;
  color: #f5f5f5;
`;

const ScreenReaderLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const loaderVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.34,
      ease: cinematicEase
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

const getTimeline = (isCompact) => {
  const duration = isCompact ? 1.55 : 2.9;

  return {
    duration,
    leftGlyph: {
      opacity: [0, 0.62, 0.78, 0.4, 0],
      x: ["-3.6em", "-4.55em", "-5.65em", "-5.9em", "-5.9em"],
      filter: ["blur(7px)", "blur(4px)", "blur(2px)", "blur(1px)", "blur(0px)"],
      transition: { duration, times: [0, 0.16, 0.36, 0.57, 0.68], ease: cinematicEase }
    },
    rightGlyph: {
      opacity: [0, 0.62, 0.78, 0.4, 0],
      x: ["3.6em", "4.55em", "5.65em", "5.9em", "5.9em"],
      filter: ["blur(7px)", "blur(4px)", "blur(2px)", "blur(1px)", "blur(0px)"],
      transition: { duration, times: [0, 0.16, 0.36, 0.57, 0.68], ease: cinematicEase }
    },
    slash: {
      opacity: [0, 0, 1, 1, 0],
      scaleY: [0.72, 0.72, 1, 1, 0.94],
      rotate: [13, 13, 13, 13, 13],
      transition: { duration, times: [0, 0.18, 0.32, 0.56, 0.7], ease: cinematicEase }
    },
    leftSegment: {
      opacity: [0, 0, 1, 1, 0],
      x: ["-4.4em", "-4.4em", "-2.4em", "-0.64em", "-0.24em"],
      letterSpacing: ["0.36em", "0.36em", "0.26em", "0.14em", "0.12em"],
      transition: { duration, times: [0, 0.54, 0.67, 0.82, 0.92], ease: cinematicEase }
    },
    rightSegment: {
      opacity: [0, 0, 1, 1, 0],
      x: ["4.4em", "4.4em", "2.4em", "0.78em", "0.28em"],
      letterSpacing: ["0.36em", "0.36em", "0.26em", "0.14em", "0.12em"],
      transition: { duration, times: [0, 0.54, 0.67, 0.82, 0.92], ease: cinematicEase }
    },
    final: {
      opacity: [0, 0, 0, 1],
      scale: [0.985, 0.985, 0.995, 1],
      transition: { duration, times: [0, 0.74, 0.88, 1], ease: cinematicEase }
    },
    glow: {
      opacity: [0.34, 0.66, 0.52, 0.78],
      scale: [0.86, 1.02, 1.08, 1],
      transition: { duration, ease: cinematicEase }
    }
  };
};

const GlobalLoader = ({ label = "Loading REDAESTH" }) => {
  const isCompact = /page|route/i.test(label);
  const timeline = useMemo(() => getTimeline(isCompact), [isCompact]);

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
      <AmbientGlow animate={timeline.glow} />
      <FineVignette />
      <LogoStage aria-hidden="true">
        <Glyph initial={false} animate={timeline.leftGlyph}>
          Я
        </Glyph>
        <Slash initial={false} animate={timeline.slash}>
          /
        </Slash>
        <Glyph initial={false} animate={timeline.rightGlyph}>
          A
        </Glyph>
        <Segment initial={false} animate={timeline.leftSegment}>
          RED
        </Segment>
        <Segment initial={false} animate={timeline.rightSegment}>
          AESTH
        </Segment>
        <FinalLogoWrap initial={false} animate={timeline.final}>
          <FinalWordmark size="lg" />
        </FinalLogoWrap>
      </LogoStage>
      <ScreenReaderLabel>{label}</ScreenReaderLabel>
    </LoaderWrapper>
  );
};

export default memo(GlobalLoader);
