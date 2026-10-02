"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared machinery for the Interactive Project Lab: a step machine
 * (play/pause/step/reset/speed), the control row, and the two evidence
 * badges that separate teaching schematics from measured project results.
 */

export function useLabSteps(total: number) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (step >= total - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(
      () => setStep((s) => Math.min(s + 1, total - 1)),
      950 / speed
    );
    return () => clearTimeout(t);
  }, [playing, step, speed, total]);

  const pause = useCallback(() => setPlaying(false), []);
  const play = useCallback(() => setPlaying(true), []);
  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const fwd = useCallback(
    () => {
      setPlaying(false);
      setStep((s) => Math.min(s + 1, total - 1));
    },
    [total]
  );
  const back = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.max(s - 1, 0));
  }, []);
  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);

  return { step, playing, speed, total, play, pause, toggle, fwd, back, reset, setSpeed };
}

export type Lab = ReturnType<typeof useLabSteps>;

export function LabControls({ lab }: { lab: Lab }) {
  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-line px-3 text-xs text-fog-mid transition-colors duration-150 hover:border-fog-mid/40 hover:text-fog-hi";
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lab controls">
      <button
        type="button"
        onClick={lab.toggle}
        aria-label={lab.playing ? "Pause" : "Play"}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-fog-hi px-4 text-xs font-medium text-ink-950 transition-opacity hover:opacity-90"
      >
        {lab.playing ? "❚❚ Pause" : "▶ Play"}
      </button>
      <button type="button" onClick={lab.back} aria-label="Step back" className={btn}>
        ◀
      </button>
      <button type="button" onClick={lab.fwd} aria-label="Step forward" className={btn}>
        ▶
      </button>
      <button type="button" onClick={lab.reset} aria-label="Reset" className={btn}>
        ↺ Reset
      </button>
      <div className="ml-1 flex items-center gap-1" role="group" aria-label="Speed">
        {[0.5, 1, 2].map((sp) => (
          <button
            key={sp}
            type="button"
            onClick={() => lab.setSpeed(sp)}
            aria-pressed={lab.speed === sp}
            aria-label={`Speed ${sp}x`}
            className={`h-9 rounded-full border px-2.5 text-[11px] transition-colors duration-150 ${
              lab.speed === sp
                ? "border-acc/60 bg-acc/10 text-fog-hi"
                : "border-line text-fog-low hover:text-fog-mid"
            }`}
          >
            {sp}×
          </button>
        ))}
      </div>
      <span className="micro ml-auto tabular-nums">
        {String(lab.step + 1).padStart(2, "0")} / {String(lab.total).padStart(2, "0")}
      </span>
    </div>
  );
}

export function SchematicBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-fog-low">
      Teaching schematic
    </span>
  );
}

export function MeasuredBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-acc/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-acc">
      Measured result
    </span>
  );
}

/** Keyboard handler for a lab panel: Space = play/pause, ←/→ = step, R = reset. */
export function useLabKeyboard(lab: Lab) {
  return (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLButtonElement && e.key === " ") return; // buttons handle Space
    if (e.key === " ") {
      e.preventDefault();
      lab.toggle();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      lab.fwd();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      lab.back();
    } else if (e.key === "r" || e.key === "R") {
      lab.reset();
    }
  };
}
