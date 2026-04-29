import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

const lenisOptions = {
  duration: 1.4,
  smoothWheel: true,
  syncTouch: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1,
  autoResize: true
};

const useLenis = () => {
  const lenisRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const lenis = new Lenis(lenisOptions);
    lenisRef.current = lenis;

    const onAnimationFrame = (time) => {
      lenis.raf(time);
      rafRef.current = window.requestAnimationFrame(onAnimationFrame);
    };

    rafRef.current = window.requestAnimationFrame(onAnimationFrame);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
};

export default useLenis;
