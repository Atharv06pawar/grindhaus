import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const PageFrame = styled(motion.main)`
  position: relative;
  min-height: 100vh;
  will-change: opacity, transform;
`;

const pageTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1]
};

const PageTransition = ({ children }) => {
  return (
    <PageFrame
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageTransition}
    >
      {children}
    </PageFrame>
  );
};

export default PageTransition;
