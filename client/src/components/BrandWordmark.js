import React from "react";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";

const sizeStyles = {
  sm: css`
    font-size: clamp(0.96rem, 1.2vw, 1.08rem);
    letter-spacing: 0.24em;
  `,
  md: css`
    font-size: clamp(1.15rem, 1.6vw, 1.35rem);
    letter-spacing: 0.28em;
  `,
  lg: css`
    font-size: clamp(2.1rem, 7vw, 5.7rem);
    letter-spacing: 0.18em;
  `
};

const Wordmark = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Bangers", "Passero One", Impact, sans-serif;
  font-weight: 700;
  line-height: 1;
  color: #f5f5f5;
  text-transform: uppercase;
  white-space: nowrap;
  ${({ $size }) => sizeStyles[$size] || sizeStyles.md};
`;

function BrandWordmark({ className, size = "md", ...motionProps }) {
  return (
    <Wordmark
      className={className}
      $size={size}
      aria-label="REDAESTH"
      {...motionProps}
    >
      REDAESTH
    </Wordmark>
  );
}

export default React.memo(BrandWordmark);
