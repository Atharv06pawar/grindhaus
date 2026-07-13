import React, { memo } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

export const INITIAL_LOADER_DURATION_MS = 6000;
const LOADER_FADE_DURATION_MS = 0.58;

const ACCENT_RED = "#FF453A";
const cinematicEase = [0.22, 1, 0.36, 1];

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
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Bangers", "Passero One", Impact, sans-serif;
  color: #f5f5f5;
  font-size: clamp(2.1rem, 7vw, 5.7rem);
`;

const WordBlock = styled(motion.div)`
  display: flex;
  align-items: baseline;
  position: relative;
  will-change: transform;
`;

const AnimatedLetter = styled(motion.span)`
  font-weight: 700;
  line-height: 1;
  color: #f5f5f5;
  letter-spacing: 0.04em;
  display: inline-block;
  transform-origin: center;
  will-change: transform, text-shadow;
`;

const RContainer = styled.span`
  position: relative;
  display: inline-block;
`;

const MirroredR = styled(motion.span)`
  position: absolute;
  inset: 0;
  display: inline-block;
  transform: scaleX(-1);
  transform-origin: center;
  will-change: clip-path;
`;

const NormalR = styled(motion.span)`
  display: inline-block;
  will-change: clip-path;
`;

const AnimatedTrailing = styled(motion.span)`
  font-weight: 700;
  line-height: 1;
  color: #f5f5f5;
  letter-spacing: 0.08em;
  display: inline-block;
  white-space: nowrap;
  will-change: clip-path, text-shadow;
`;

const Slash = styled(motion.span)`
  position: absolute;
  color: ${ACCENT_RED};
  font-size: clamp(4.8rem, 12vw, 9rem);
  font-weight: 300;
  line-height: 1;
  transform-origin: center;
  will-change: transform, opacity, filter;
  pointer-events: none;
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

const getTimeline = () => {
  const duration = 6;
  // Keyframes: 0s, 1s, 1.5s, 2.5s, 3s, 4s, 5.2s, 5.3s, 6s
  const times = [0, 0.166, 0.25, 0.416, 0.5, 0.666, 0.866, 0.883, 1];

  return {
    leftBlock: {
      x: ["-1.5em", "-0.5em", "-2.5em", "-2.5em", "-0.5em", "-0.5em", "0em", "0em", "0em"],
      scale: [1.9, 1.9, 1.9, 1.9, 1, 1, 1, 1, 1],
      opacity: [1, 1, 1, 1, 1, 1, 1, 1, 0],
      transition: { duration, times, ease: cinematicEase }
    },
    rightBlock: {
      x: ["1.5em", "1.5em", "2.5em", "2.5em", "0.5em", "0.5em", "0em", "0em", "0em"],
      scale: [1.9, 1.9, 1.9, 1.9, 1, 1, 1, 1, 1],
      opacity: [1, 1, 1, 1, 1, 1, 1, 1, 0],
      transition: { duration, times, ease: cinematicEase }
    },
    mirroredR: {
      clipPath: [
        "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)",
        "inset(0 0% 0 100%)", "inset(0 0% 0 100%)", "inset(0 0% 0 100%)", "inset(0 0% 0 100%)", "inset(0 0% 0 100%)"
      ],
      transition: { duration, times, ease: cinematicEase }
    },
    normalR: {
      clipPath: [
        "inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 100% 0 0)",
        "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)"
      ],
      transition: { duration, times, ease: cinematicEase }
    },
    edText: {
      clipPath: [
        "inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 100% 0 0)",
        "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)"
      ],
      transition: { duration, times, ease: cinematicEase }
    },
    esthText: {
      clipPath: [
        "inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 100% 0 0)",
        "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)"
      ],
      transition: { duration, times, ease: cinematicEase }
    },
    glowText: {
      textShadow: [
        "0 0 0px transparent", "0 0 0px transparent", "0 0 0px transparent", "0 0 0px transparent",
        "0 0 0px transparent", "0 0 0px transparent", "0 0 0px transparent",
        "0 0 20px rgba(255, 69, 58, 0.3)", "0 0 20px rgba(255, 69, 58, 0.3)"
      ],
      transition: { duration, times, ease: cinematicEase }
    },
    slash: {
      opacity: [0, 0, 0.8, 1, 0, 0, 0, 0, 0],
      scaleY: [0, 0, 5.5, 1, 0.8, 0.8, 0.8, 0.8, 0.8],
      scaleX: [0, 0, 2.2, 1, 0.8, 0.8, 0.8, 0.8, 0.8],
      filter: [
        "blur(0px)", "blur(0px)", "blur(8px)", "blur(0px)", 
        "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"
      ],
      rotate: [13, 13, 13, 13, 13, 13, 13, 13, 13],
      transition: { duration, times, ease: cinematicEase }
    },
    glow: {
      opacity: [0.2, 0.2, 0.4, 0.4, 0.5, 0.5, 0.4, 0.4, 0.4],
      scale: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      transition: { duration, times, ease: cinematicEase }
    }
  };
};

const StartupLoader = ({ label = "Starting REDAESTH" }) => {
  const timeline = getTimeline();

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
        <WordBlock animate={timeline.leftBlock}>
          <AnimatedLetter animate={timeline.glowText}>
            <RContainer>
              <MirroredR animate={timeline.mirroredR}>R</MirroredR>
              <NormalR animate={timeline.normalR}>R</NormalR>
            </RContainer>
          </AnimatedLetter>
          <AnimatedTrailing animate={{ ...timeline.edText, ...timeline.glowText }}>
            ed
          </AnimatedTrailing>
        </WordBlock>

        <Slash animate={timeline.slash}>/</Slash>

        <WordBlock animate={timeline.rightBlock}>
          <AnimatedLetter animate={timeline.glowText}>
            A
          </AnimatedLetter>
          <AnimatedTrailing animate={{ ...timeline.esthText, ...timeline.glowText }}>
            esth
          </AnimatedTrailing>
        </WordBlock>
      </LogoStage>
      <ScreenReaderLabel>{label}</ScreenReaderLabel>
    </LoaderWrapper>
  );
};

export default memo(StartupLoader);