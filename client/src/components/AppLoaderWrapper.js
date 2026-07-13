import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import StartupLoader, { INITIAL_LOADER_DURATION_MS } from "./StartupLoader";

export default function AppLoaderWrapper({ children, isReady = true }) {
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimationComplete(true);
    }, INITIAL_LOADER_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationComplete && isReady) {
      setIsBootLoading(false);
    }
  }, [animationComplete, isReady]);

  return (
    <>
      <AnimatePresence>
        {isBootLoading && <StartupLoader key="startup-loader" label="Starting REDAESTH" />}
      </AnimatePresence>
      {/* Children are always rendered so the DOM mounts and assets begin downloading in the background */}
      {children}
    </>
  );
}
