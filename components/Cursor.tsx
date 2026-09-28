"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: an instant ink dot + a lerped hairline ring, both rendered
 * with difference blending so they invert over any surface in either theme.
 * The ring expands over interactive elements; elements marked [data-magnetic]
 * are gently pulled toward the pointer. Only mounts for fine pointers with
 * motion allowed; native cursor stays if JS is off or reduced motion is set.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActive(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-cursor");

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let shown = false;
    let interactive = false;
    let pressed = false;
    let mag: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        rx = mx;
        ry = my;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
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
      ring.style.opacity = "0";
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
        pressed ? 0.6 : interactive ? 0.45 : 1
      })`;

      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${
        pressed ? 0.8 : interactive ? 1.7 : 1
      })`;
      ring.style.opacity = shown ? (interactive ? "0.9" : "1") : "0";

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
  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
