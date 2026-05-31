import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import GlobalLoader, { ROUTE_LOADER_DURATION_MS } from "./GlobalLoader";

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
    }, ROUTE_LOADER_DURATION_MS);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isVisible ? <GlobalLoader key="route-loader" label="Loading REDAESTH page" /> : null}
    </AnimatePresence>
  );
}

export default RouteLoader;
