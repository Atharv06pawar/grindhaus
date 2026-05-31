import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      window.__redaesthLenis?.scrollTo(0, {
        force: true,
        immediate: true,
        lock: true
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname]);

  return null;
}

export default ScrollToTopOnRouteChange;
