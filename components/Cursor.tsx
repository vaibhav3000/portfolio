"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a single difference-blend dot that shrinks over
 * interactive elements and gently magnets [data-magnetic] targets.
 * Only mounts for fine pointers with motion allowed; the native cursor
 * stays if JS is off or reduced motion is set.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActive(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add("has-cursor");

    let mx = -100;
    let my = -100;
    let shown = false;
    let interactive = false;
    let pressed = false;
    let mag: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        dot.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      interactive = !!t?.closest("a, button, [data-cursor-hover]");
      mag = (t?.closest("[data-magnetic]") as HTMLElement) ?? null;
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeave = () => {
      shown = false;
      dot.style.opacity = "0";
      if (mag) {
        mag.style.transform = "";
        mag = null;
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%) scale(${
        pressed ? 0.7 : interactive ? 1.5 : 1
      })`;

      if (mag) {
        const rect = mag.getBoundingClientRect();
        const dx = mx - (rect.left + rect.width / 2);
        const dy = my - (rect.top + rect.height / 2);
        mag.style.transform = `translate(${dx * 0.16}px, ${dy * 0.16}px)`;
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (mag) mag.style.transform = "";
    };
  }, [active]);

  if (!active) return null;
  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
