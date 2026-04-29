import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { ROUTE_LOADER_DURATION_MS } from "../components/GlobalLoader";

const getRouteSignature = (location) => {
  return `${location.pathname}${location.search}${location.hash}`;
};

const useRouteTransition = (lenisRef) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const routeSignatureRef = useRef(getRouteSignature(location));
  const timeoutRef = useRef(0);
  const frameRef = useRef(0);
  const paintFrameRef = useRef(0);

  useEffect(() => {
    const nextRouteSignature = getRouteSignature(location);
    const activeLenis = lenisRef.current;

    if (routeSignatureRef.current === nextRouteSignature) {
      return undefined;
    }

    routeSignatureRef.current = nextRouteSignature;
    setIsRouteTransitioning(true);

    if (activeLenis) {
      activeLenis.stop();
      activeLenis.scrollTo(0, { immediate: true, force: true });
    }

    timeoutRef.current = window.setTimeout(() => {
      setDisplayLocation(location);

      frameRef.current = window.requestAnimationFrame(() => {
        paintFrameRef.current = window.requestAnimationFrame(() => {
          if (activeLenis) {
            activeLenis.resize();
            activeLenis.start();
          }

          setIsRouteTransitioning(false);
        });
      });
    }, ROUTE_LOADER_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutRef.current);
      window.cancelAnimationFrame(frameRef.current);
      window.cancelAnimationFrame(paintFrameRef.current);

      if (activeLenis?.isStopped) {
        activeLenis.start();
      }
    };
  }, [lenisRef, location]);

  return {
    displayLocation,
    isRouteTransitioning
  };
};

export default useRouteTransition;
