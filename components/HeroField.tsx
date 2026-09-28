"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Client gate for the hero WebGL field. Renders nothing visual itself:
 * the static SVG fallback lives underneath in Hero.tsx and simply stays
 * visible if this canvas never activates (reduced motion, no WebGL, JS off).
 */
export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const capable = () => {
      if (mq.matches) return false;
      const probe = document.createElement("canvas");
      const gl =
        probe.getContext("webgl2") ??
        probe.getContext("webgl") ??
        probe.getContext("experimental-webgl");
      return gl !== null;
    };
    setAllowed(capable());
    const onMq = () => setAllowed(capable());
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (!allowed || !canvasRef.current) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("./latentFieldScene").then((m) => {
      if (cancelled) return;
      dispose = m.mountField(canvasRef.current as HTMLCanvasElement);
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [allowed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-ready="false"
      className="hero-canvas absolute inset-0 h-full w-full"
    />
  );
}
