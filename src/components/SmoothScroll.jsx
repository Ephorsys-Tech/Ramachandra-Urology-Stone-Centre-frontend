import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

/**
 * SmoothScroll component integrates Lenis smooth scrolling globally.
 * It provides controlled, inertia-based fluid scrolling and eliminates
 * abrupt, overly-fast mouse wheel jumps.
 */
const SmoothScroll = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable Lenis on admin portal routes so nested mouse wheel scrolling works natively
    if (pathname.startsWith("/admin")) {
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2, // Smooth ease duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85, // Calibrated wheel multiplier for smooth, controlled scrolling
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      window.lenis = null;
    };
  }, [pathname]);

  // Scroll to top cleanly on route navigation
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return children;
};

export default SmoothScroll;
