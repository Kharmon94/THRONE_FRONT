import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";

export function useReduceAnimations(): boolean {
  const prefersReduced = useReducedMotion() ?? false;
  const [isMobileOrTouch, setIsMobileOrTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(max-width: 768px), (hover: none) and (pointer: coarse)"
    );
    const handler = () => setIsMobileOrTouch(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced || isMobileOrTouch;
}
