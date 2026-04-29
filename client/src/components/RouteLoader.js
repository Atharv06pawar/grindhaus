import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import { LoaderLogo, LoaderPulse, RouteLoaderOverlay } from "../styles/ui";

function RouteLoader() {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const timeoutRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) {
      return undefined;
    }

    previousPathRef.current = location.pathname;
    setIsVisible(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      timeoutRef.current = null;
    }, 420);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <RouteLoaderOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          role="presentation"
        >
          <LoaderPulse>
            <LoaderLogo src="/grindhaus-logo.png" alt="" aria-hidden="true" />
          </LoaderPulse>
        </RouteLoaderOverlay>
      ) : null}
    </AnimatePresence>
  );
}

export default RouteLoader;
