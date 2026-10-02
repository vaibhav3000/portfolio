"use client";

import { Lab, LabControls, MeasuredBadge, SchematicBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 01 explainer: how an SSM reads a sequence, what selectivity and
 * chunked SSD change, and where the measured numbers come from.
 */

const TOKENS = 12;

export default function LabMamba() {
  const STEPS = 6;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);
  const on = (k: number) => lab.step >= k;

  const texts = [
    "A sequence of tokens enters the model. Every architecture in this study reads the same input through the same skeleton.",
    "The SSM idea: a fixed-size state flows along the sequence, one update per token - O(T) operations, O(1) state per step.",
    "Mamba makes Δ, B, C input-dependent: the model chooses what to remember and what to forget at every position.",
    "Mamba-2 rewrites the scan as chunked matmuls with a carried state - tested equivalent to the sequential loop at 1e-3.",
    "How the costs scale with sequence length (sketch of the trend; the real sweep is on the case-study page).",
    "The numbers that came out of the study, measured on a 6 GB RTX 4050 and committed as JSON.",
  ];

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="Sequence modeling lab: use space to play or pause, arrows to step, R to reset"
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      <div className="relative h-[330px] sm:h-[300px]">
        {/* step 0-3: token row */}
        <div
          className="absolute inset-x-0 top-1 flex justify-between transition-all duration-700"
          style={{ opacity: lab.step <= 3 ? 1 : 0.12 }}
        >
          {Array.from({ length: TOKENS }).map((_, i) => {
            const selective = on(2) && (i === 2 || i === 6 || i === 9);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                {selective && (
                  <span className="font-mono text-[9px] leading-none text-acc">ΔBC</span>
                )}
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded border font-mono text-[9px] transition-colors duration-500 sm:h-7 sm:w-7 sm:text-[10px] ${
                    selective
                      ? "border-acc/70 bg-acc/15 text-fog-hi"
                      : "border-line text-fog-low"
                  }`}
                >
                  x{i + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* step 1: recurrence arrow + state + formula */}
        <div
          className="absolute inset-x-0 top-[92px] transition-all duration-700"
          style={{ opacity: lab.step === 1 ? 1 : 0, transform: lab.step === 1 ? "none" : "translateY(10px)" }}
        >
          <svg viewBox="0 0 640 60" className="w-full" aria-hidden="true">
            
            {Array.from({ length: 6 }).map((_, i) => (
              <path
                key={i}
                d={`M ${53 + i * 107} 4 v 18 h 30`}
                fill="none"
                stroke="rgb(var(--acc) / 0.4)"
                strokeWidth="1.5"
              />
            ))}
            <rect x="240" y="26" width="160" height="30" rx="8" className="f-node" style={{ stroke: "rgb(var(--acc) / 0.5)" }} />
            <text x="320" y="45" textAnchor="middle" className="f-hi" fontSize="12" fontFamily="var(--font-mono)">
              state hₜ (fixed size)
            </text>
          </svg>
          <p className="mt-1 text-center font-mono text-[11px] text-fog-mid">
            xₜ = Āxₜ₋₁ + B̄uₜ &nbsp;·&nbsp; yₜ = Cxₜ
          </p>
        </div>

        {/* step 3: chunks */}
        <div
          className="absolute inset-x-0 top-[100px] transition-all duration-700"
          style={{ opacity: lab.step === 3 ? 1 : 0, transform: lab.step === 3 ? "none" : "translateY(10px)" }}
        >
          <div className="flex justify-between gap-2">
            {[0, 1, 2].map((c) => (
              <div key={c} className="flex-1 rounded-lg border border-dashed border-acc/40 px-2 py-2 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-fog-low">
                  chunk {c + 1}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-fog-mid">
                  {c < 2 ? "state → next chunk" : "final state"}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center font-mono text-[11px] text-fog-mid">
            T/64 chunks · block matmuls + carried (N, P) state
          </p>
        </div>

        {/* step 4: scaling sketch */}
        <div
          className="absolute inset-x-0 top-[86px] transition-all duration-700"
          style={{ opacity: lab.step === 4 ? 1 : 0, transform: lab.step === 4 ? "none" : "translateY(10px)" }}
        >
          <svg viewBox="0 0 640 180" className="w-full" role="img" aria-label="Sketch: attention cost bends upward with sequence length while the SSM line stays flat">
            <line x1="50" y1="150" x2="610" y2="150" className="s-line" />
            <line x1="50" y1="150" x2="50" y2="20" className="s-line" />
            <polyline points="60,142 200,136 340,120 480,84 600,30" fill="none" className="s-line-strong" strokeWidth="2" />
            <polyline points="60,140 200,138 340,135 480,131 600,128" fill="none" className="s-acc" strokeWidth="2" />
            <text x="612" y="34" className="f-mid" fontSize="11" fontFamily="var(--font-mono)" textAnchor="end">
              attention
            </text>
            <text x="612" y="120" className="f-acc" fontSize="11" fontFamily="var(--font-mono)" textAnchor="end">
              SSM
            </text>
            <text x="330" y="172" className="f-low" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
              sequence length (log) →
            </text>
          </svg>
          <div className="mt-1 flex items-center gap-3">
            <SchematicBadge />
            <p className="text-xs text-fog-low">Endpoints reflect the measured sweep; curves sketch the trend.</p>
          </div>
        </div>

        {/* step 5: measured */}
        <div
          className="absolute inset-x-0 top-[64px] transition-all duration-700"
          style={{ opacity: lab.step === 5 ? 1 : 0, transform: lab.step === 5 ? "none" : "translateY(10px)" }}
        >
          <div className="flex items-center gap-3">
            <MeasuredBadge />
            <p className="text-xs text-fog-low">results/*.json · RTX 4050 6 GB · seed 42</p>
          </div>
          <dl className="mt-4 space-y-3.5">
            {[
              ["0.983 vs 0.51-0.56", "cumulative-XOR parity: only complex transitions clear chance"],
              ["67% vs 6.4%", "selective copying: selective SSMs learn it, LTI S4D collapses"],
              ["30 ms → 186 s", "Transformer train step, 1K → 32K tokens"],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-4 border-b border-line pb-3">
                <dt className="w-44 shrink-0 text-xl font-light tracking-tight text-fog-hi tabular-nums">{v}</dt>
                <dd className="text-[13px] leading-snug text-fog-mid">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* explanation + controls */}
      <div className="mt-4 border-t border-line pt-4">
        <p className="min-h-[40px] text-sm leading-relaxed text-fog-mid">{texts[lab.step]}</p>
        <div className="mt-3">
          <LabControls lab={lab} />
        </div>
      </div>
    </div>
  );
}
