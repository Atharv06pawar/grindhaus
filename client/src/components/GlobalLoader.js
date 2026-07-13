import React, { memo } from "react";
import { RouteLoaderOverlay, LoaderLogo } from "../styles/ui";

export const ROUTE_LOADER_DURATION_MS = 600;

const loaderVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const GlobalLoader = ({ label = "Loading REDAESTH" }) => {
  return (
    <RouteLoaderOverlay
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={loaderVariants}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <LoaderLogo aria-hidden="true" />
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {label}
      </span>
    </RouteLoaderOverlay>
  );
};

export default memo(GlobalLoader);
