import { useEffect, useRef } from "react";
import Lenis from "lenis";

function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
      smoothWheel: true,
      syncTouch: true
    });

    lenisRef.current = lenis;
    let frameId = null;

    const tick = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    window.__grindhausLenis = lenis;

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      lenis.destroy();
      lenisRef.current = null;
      window.__grindhausLenis = null;
    };
  }, []);

  return lenisRef;
}

export default useLenis;
