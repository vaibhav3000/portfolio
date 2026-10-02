"use client";

import Image from "next/image";
import { LabControls, MeasuredBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 01 explainer: one persistent scene - tokens flow into a fixed-size
 * state, selectivity lights up, chunked SSD partitions the strip, then the
 * REAL benchmark figures carry the evidence (efficiency sweep + parity).
 */

const TOKENS = 12;
const TX = (i: number) => 22 + i * 51;

export default function LabMamba() {
  const STEPS = 6;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);
  const on = (k: number) => lab.step >= k;
  const selective = (i: number) => on(2) && (i === 2 || i === 6 || i === 9);
  const stateFill = (i: number) => {
    if (!on(1)) return 0;
    if (!on(2)) return i < 7 ? 1 : 0;
    if (!on(3)) return i === 2 || i === 6 || i === 9 ? 1 : i < 7 ? 0.35 : 0;
    return 1;
  };

  const texts = [
    "A sequence of tokens enters the model. Every architecture in the study reads this same input through one shared skeleton.",
    "The SSM core: a fixed-size state flows along the sequence, one update per token - O(T) operations, O(1) state per step.",
    "Mamba makes Δ, B, C input-dependent: highlighted tokens reshape the state update. What to remember becomes a decision.",
    "Mamba-2 rewrites the recurrence as chunked block-matmuls with a carried state - proven equivalent to the sequential loop at 1e-3.",
    "The real efficiency sweep on the 6 GB RTX 4050: attention's training step reaches 186 s at 32K while SSM forms hold - until memory runs out.",
    "And the capability result the study is about: only complex-valued transitions clear chance on cumulative-XOR parity.",
  ];

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="Sequence modeling lab: use space to play or pause, arrows to step, R to reset"
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      <svg viewBox="0 0 640 210" className="lab-scene mx-auto w-full max-w-[1000px]" role="img" aria-label="Tokens flowing into a recurrent state, selective updates, and chunked processing">
        {/* tokens */}
        {Array.from({ length: TOKENS }).map((_, i) => {
          const sel = selective(i);
          const dim = on(4);
          return (
            <g key={i} style={{ opacity: dim ? 0.25 : 1, transition: "opacity .6s" }}>
              {sel && (
                <text x={TX(i) + 17} y="14" textAnchor="middle" className="f-acc" fontSize="10" fontFamily="var(--font-mono)">
                  ΔBC
                </text>
              )}
              <rect
                x={TX(i)}
                y={sel ? 18 : 22}
                width="34"
                height="28"
                rx="6"
                className={sel ? "f-acc-soft" : "f-node s-line"}
                style={{ stroke: sel ? "rgb(var(--acc) / 0.8)" : undefined, transition: "all .5s" }}
              />
              <text x={TX(i) + 17} y={sel ? 37 : 41} textAnchor="middle" className={sel ? "f-hi" : "f-mid"} fontSize="10" fontFamily="var(--font-mono)">
                x{i + 1}
              </text>
            </g>
          );
        })}

        {/* recurrence arrows + state bar (step >= 1) */}
        <g style={{ opacity: on(1) && !on(3) ? 1 : 0.15, transition: "opacity .6s" }}>
          {Array.from({ length: TOKENS }).map((_, i) => (
            <line key={i} x1={TX(i) + 17} y1="54" x2={TX(i) + 17} y2={on(2) && selective(i) ? 76 : 70} className={selective(i) ? "s-acc-dim" : "s-line"} strokeWidth="1.5" />
          ))}
          <rect x="22" y="82" width="596" height="26" rx="7" className="f-node s-line-strong" style={{ stroke: "rgb(var(--acc) / 0.35)" }} />
          {Array.from({ length: TOKENS }).map((_, i) => {
            const f = stateFill(i);
            return f > 0 ? (
              <rect
                key={i}
                x={24 + i * 49.4}
                y="84.5"
                width="47.4"
                height="21"
                rx="4"
                style={{
                  fill: selective(i) && on(2) ? "rgb(var(--acc) / 0.75)" : "rgb(var(--acc) / 0.35)",
                  opacity: f,
                  transition: "opacity .6s, fill .6s",
                }}
              />
            ) : null;
          })}
          <text x="316" y="126" textAnchor="middle" className="f-mid" fontSize="12" fontFamily="var(--font-mono)">
            state hₜ = Ā·hₜ₋₁ + B̄·xₜ → yₜ = C·hₜ
          </text>
        </g>

        {/* chunked SSD brackets (step 3) */}
        <g style={{ opacity: on(3) && !on(4) ? 1 : 0, transition: "opacity .6s" }}>
          {[0, 1, 2, 3].map((c) => (
            <g key={c}>
              <path d={`M ${22 + c * 149} 118 v 8 h 149 v -8`} fill="none" className="s-acc-dim" strokeWidth="1.5" />
              <text x={22 + c * 149 + 74.5} y="142" textAnchor="middle" className="f-acc" fontSize="10" fontFamily="var(--font-mono)">
                chunk {c + 1}
              </text>
              {c < 3 && (
                <text x={22 + c * 149 + 149} y="136" textAnchor="middle" className="f-mid" fontSize="11" fontFamily="var(--font-mono)">
                  →
                </text>
              )}
            </g>
          ))}
          <text x="316" y="164" textAnchor="middle" className="f-mid" fontSize="11" fontFamily="var(--font-mono)">
            block matmuls + carried (N, P) state · T/64 chunks
          </text>
        </g>

        {/* architecture evolution strip */}
        <g style={{ opacity: on(4) || on(5) ? 0.2 : 1, transition: "opacity .6s" }}>
          {["S4D", "Mamba", "Mamba-2", "Mamba-3"].map((n, i) => (
            <g key={n}>
              <rect x={34 + i * 152} y="150" width="118" height="40" rx="9" className="f-node s-line-strong" />
              <text x={34 + i * 152 + 59} y="167" textAnchor="middle" className="f-hi" fontSize="12" fontFamily="var(--font-mono)">
                {n}
              </text>
              <text x={34 + i * 152 + 59} y="182" textAnchor="middle" className="f-low" fontSize="8.5" fontFamily="var(--font-mono)">
                {["LTI · conv", "selective", "chunked SSD", "complex Δ"][i]}
              </text>
              {i < 3 && <path d={`M ${152 + i * 152} 170 h 32`} fill="none" className="edge-flow s-acc-dim" strokeWidth="1.5" />}
            </g>
          ))}
        </g>
      </svg>

      {/* step content below the scene */}
      <div className="mt-2 min-h-[120px]">
        {on(4) && (
          <div style={{ animation: "ddfade .6s" }}>
            <div className="mb-2 flex items-center gap-3">
              <MeasuredBadge />
              <span className="text-xs text-fog-low">results/efficiency_gpu.json · CUDA events · 5 repeats · batch 8</span>
            </div>
            <div className="mx-auto max-w-[900px] overflow-hidden rounded-xl border border-line bg-white">
              <Image src="/projects/s4-to-mamba/efficiency.png" alt="Measured training-step latency and peak memory versus sequence length for all five architectures" width={1100} height={560} className="h-auto w-full" />
            </div>
          </div>
        )}
        {lab.step === 5 && (
          <div style={{ animation: "ddfade .6s" }} className="mt-4 grid gap-4 sm:grid-cols-[300px_1fr] sm:items-center">
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <Image src="/projects/s4-to-mamba/parity.png" alt="Parity accuracy: only the complex-transition model clears chance" width={520} height={330} className="h-auto w-full" />
            </div>
            <dl className="space-y-3">
              {[
                ["0.983", "parity, Mamba-3 - baselines sit at chance"],
                ["67% / 6.4%", "selective copying: Mamba-2 vs LTI S4D"],
                ["14 tests", "chunked ≡ sequential · FFT ≡ recurrent · λ=1 reduction"],
              ].map(([v, l]) => (
                <div key={l} className="flex items-baseline gap-4 border-b border-line pb-2.5">
                  <dt className="w-28 shrink-0 text-lg font-light tracking-tight text-fog-hi tabular-nums">{v}</dt>
                  <dd className="text-[13px] leading-snug text-fog-mid">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {!on(4) && (
          <p className="text-sm leading-relaxed text-fog-mid" style={{ animation: "ddfade .6s" }}>
            {texts[lab.step]}
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <LabControls lab={lab} />
      </div>
    </div>
  );
}
