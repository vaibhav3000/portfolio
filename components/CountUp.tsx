"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric string up from 0 when it enters the viewport.
 * Server-renders the final value (no-JS users see the real number);
 * on reveal it snaps to 0 and eases up over ~1.3s. Reduced motion
 * keeps the static value.
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const match = value.match(/^([\d.]+)$/);
    if (!match) return;
    const target = parseFloat(match[1]);
    if (Number.isNaN(target)) return;
    const decimals = (match[1].split(".")[1] ?? "").length;

    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries[0]?.isIntersecting) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1300;
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay((target * eased).toFixed(decimals));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setDisplay(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
