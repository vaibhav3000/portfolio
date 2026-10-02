"use client";

import Image from "next/image";
import { useState } from "react";
import { LabControls, MeasuredBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 01 explainer: tokens -> recurrent state -> selectivity -> chunked
 * SSD -> equivalence testing -> the real efficiency + parity figures.
 * Selective tokens are clickable at step 3.
 */

const TOKENS = 12;
const TX = (i: number) => 22 + i * 51;
const SEL = [2, 6, 9];

export default function LabMamba() {
  const STEPS = 8;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);
  const [selToken, setSelToken] = useState<number | null>(null);
  const on = (k: number) => lab.step >= k;
  const selective = (i: number) => on(2) && SEL.includes(i);
  const stateFill = (i: number) => {
    if (!on(1)) return 0;
    if (!on(2)) return i < 7 ? 1 : 0;
    if (!on(3)) return SEL.includes(i) ? 1 : i < 7 ? 0.35 : 0;
    return 1;
  };

  const steps = [
    { t: "Tokens in", d: "A sequence of tokens enters the model. Every architecture in the study reads this same input through one shared skeleton." },
    { t: "Recurrent state", d: "The SSM core: a fixed-size state flows along the sequence, one update per token - O(T) operations, O(1) state per step." },
    { t: "Selective update", d: "Mamba makes Δ, B, C input-dependent: highlighted tokens reshape the state update. Click a highlighted token to inspect it." },
    { t: "Chunked SSD", d: "Mamba-2 rewrites the recurrence as chunked block-matmuls with a carried state - T/64 chunks instead of a T-step loop." },
    { t: "Equivalence proof", d: "The claim that matters: chunked scan equals the sequential loop. A test asserts both forms agree at atol/rtol 1e-3, for aligned and misaligned chunks." },
    { t: "Efficiency sweep", d: "The real benchmark on the 6 GB RTX 4050: attention's training step reaches 186 s at 32K while SSM forms hold - until memory runs out." },
    { t: "Capability result", d: "Only complex-valued transitions clear chance on cumulative-XOR parity. LTI S4D collapses to 6% on selective copying." },
    { t: "What it means", d: "Architecture generation, task formulation and wall-clock cost are three different axes - the study measures all three honestly." },
  ];

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="Sequence modeling lab: use space to play or pause, arrows to step, R to reset"
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      <svg viewBox="0 0 640 206" className="lab-scene mx-auto w-full" role="img" aria-label="Tokens flowing into a recurrent state, selective updates, and chunked processing">
        {/* tokens (clickable at the selectivity step) */}
        {Array.from({ length: TOKENS }).map((_, i) => {
          const sel = selective(i);
          const picked = selToken === i;
          const dim = on(5);
          return (
            <g
              key={i}
              className={sel ? "cursor-pointer" : ""}
              style={{ opacity: dim ? 0.25 : 1, transition: "opacity .6s" }}
              onClick={sel ? () => setSelToken((v) => (v === i ? null : i)) : undefined}
            >
              {sel && (
                <text x={TX(i) + 17} y="13" textAnchor="middle" className="f-acc" fontSize="10" fontFamily="var(--font-mono)">
                  ΔBC
                </text>
              )}
              <rect
                x={TX(i)}
                y={sel ? 17 : 21}
                width="34"
                height="27"
                rx="6"
                className={sel || picked ? "f-acc-soft" : "f-node s-line"}
                style={{ stroke: sel ? "rgb(var(--acc) / 0.8)" : picked ? "rgb(var(--acc) / 0.5)" : undefined, transition: "all .5s" }}
              />
              <text x={TX(i) + 17} y={sel || picked ? 35 : 39} textAnchor="middle" className={sel ? "f-hi" : "f-mid"} fontSize="10" fontFamily="var(--font-mono)">
                x{i + 1}
              </text>
            </g>
          );
        })}

        {/* recurrence arrows + state bar */}
        <g style={{ opacity: on(1) && !on(3) ? 1 : 0, transition: "opacity .6s" }}>
          {Array.from({ length: TOKENS }).map((_, i) => (
            <line key={i} x1={TX(i) + 17} y1="52" x2={TX(i) + 17} y2={on(2) && SEL.includes(i) ? 74 : 68} className={on(2) && SEL.includes(i) ? "s-acc-dim" : "s-line"} strokeWidth="1.5" />
          ))}
          <rect x="22" y="80" width="596" height="24" rx="7" className="f-node s-line-strong" style={{ stroke: "rgb(var(--acc) / 0.35)" }} />
          {Array.from({ length: TOKENS }).map((_, i) => {
            const f = stateFill(i);
            return f > 0 ? (
              <rect
                key={i}
                x={24 + i * 49.4}
                y="82.5"
                width="47.4"
                height="19"
                rx="4"
                style={{
                  fill: SEL.includes(i) && on(2) ? "rgb(var(--acc) / 0.75)" : "rgb(var(--acc) / 0.35)",
                  opacity: f,
                  transition: "opacity .6s, fill .6s",
                }}
              />
            ) : null;
          })}
          <text x="316" y="122" textAnchor="middle" className="f-mid" fontSize="12" fontFamily="var(--font-mono)">
            hₜ = Ā·hₜ₋₁ + B̄·xₜ → yₜ = C·hₜ
          </text>
        </g>

        {/* chunked SSD brackets */}
        <g style={{ opacity: on(3) && !on(4) ? 1 : 0, transition: "opacity .6s" }}>
          {[0, 1, 2, 3].map((c) => (
            <g key={c}>
              <path d={`M ${22 + c * 149} 114 v 8 h 149 v -8`} fill="none" className="s-acc-dim" strokeWidth="1.5" />
              <text x={22 + c * 149 + 74.5} y="138" textAnchor="middle" className="f-acc" fontSize="10" fontFamily="var(--font-mono)">
                chunk {c + 1}
              </text>
              {c < 3 && (
                <text x={22 + c * 149 + 149} y="132" textAnchor="middle" className="f-mid" fontSize="11" fontFamily="var(--font-mono)">
                  →
                </text>
              )}
            </g>
          ))}
        </g>

        {/* equivalence test visual (step 5) */}
        <g style={{ opacity: lab.step === 4 ? 1 : 0, transition: "opacity .6s" }}>
          <rect x="60" y="112" width="240" height="52" rx="9" className="f-node s-line" />
          <text x="180" y="133" textAnchor="middle" className="f-hi" fontSize="11" fontFamily="var(--font-mono)">
            chunked_scan()
          </text>
          <text x="180" y="151" textAnchor="middle" className="f-low" fontSize="9.5" fontFamily="var(--font-mono)">
            block matmuls · T/64
          </text>
          <rect x="340" y="112" width="240" height="52" rx="9" className="f-node s-line" />
          <text x="460" y="133" textAnchor="middle" className="f-hi" fontSize="11" fontFamily="var(--font-mono)">
            sequential_scan()
          </text>
          <text x="460" y="151" textAnchor="middle" className="f-low" fontSize="9.5" fontFamily="var(--font-mono)">
            reference loop
          </text>
          <text x="320" y="143" textAnchor="middle" className="f-ok" fontSize="14" fontFamily="var(--font-mono)">
            ≡
          </text>
          <text x="320" y="160" textAnchor="middle" className="f-ok" fontSize="9" fontFamily="var(--font-mono)">
            atol 1e-3
          </text>
          <text x="320" y="201" textAnchor="middle" className="f-low" fontSize="9.5" fontFamily="var(--font-mono)">
            14-test suite · aligned + misaligned chunks
          </text>
        </g>

        {/* stage evolution strip */}
        <g style={{ opacity: lab.step === 4 ? 0 : lab.step >= 5 ? 0.12 : 1, transition: "opacity .6s" }}>
          {["S4D", "Mamba", "Mamba-2", "Mamba-3"].map((n, i) => (
            <g key={n}>
              <rect x={34 + i * 152} y="146" width="118" height="40" rx="9" className="f-node s-line-strong" />
              <text x={34 + i * 152 + 59} y="163" textAnchor="middle" className="f-hi" fontSize="12" fontFamily="var(--font-mono)">
                {n}
              </text>
              <text x={34 + i * 152 + 59} y="178" textAnchor="middle" className="f-low" fontSize="8.5" fontFamily="var(--font-mono)">
                {["LTI · conv", "selective", "chunked SSD", "complex Δ"][i]}
              </text>
              {i < 3 && <path d={`M ${152 + i * 152} 166 h 32`} fill="none" className="edge-flow s-acc-dim" strokeWidth="1.5" />}
            </g>
          ))}
        </g>
      </svg>

      <div className="mt-3">
        {lab.step === 5 && (
          <div className="mb-2 flex items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">results/efficiency_gpu.json · CUDA events · 5 repeats · batch 8</span>
          </div>
        )}
        {lab.step === 5 && (
          <div style={{ animation: "ddfade .6s" }}>
            <div className="mx-auto max-w-[680px] overflow-hidden rounded-xl border border-line bg-white">
              <Image src="/projects/s4-to-mamba/efficiency.png" alt="Measured training-step latency and peak memory versus sequence length for all five architectures" width={1100} height={560} className="h-auto w-full" />
            </div>
          </div>
        )}
        {lab.step === 6 && (
          <div style={{ animation: "ddfade .6s" }} className="grid gap-4 sm:grid-cols-[260px_1fr] sm:items-center">
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <Image src="/projects/s4-to-mamba/parity.png" alt="Parity accuracy: only the complex-transition model clears chance" width={520} height={330} className="h-auto w-full" />
            </div>
            <dl className="space-y-2.5">
              {[
                ["0.983", "parity, Mamba-3 - baselines at chance"],
                ["67% / 6.4%", "selective copying: Mamba-2 vs LTI S4D"],
              ].map(([v, l]) => (
                <div key={l} className="flex items-baseline gap-4 border-b border-line pb-2">
                  <dt className="w-24 shrink-0 text-base font-light text-fog-hi tabular-nums">{v}</dt>
                  <dd className="text-[13px] leading-snug text-fog-mid">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {lab.step === 7 && (
          <div style={{ animation: "ddfade .6s" }} className="rounded-xl border border-line bg-ink-900/40 p-4">
            <p className="text-[13px] leading-relaxed text-fog-mid">
              <span className="text-fog-hi">Honest accounting:</span> single seed on one laptop GPU, no fused
              kernels, full S4 not implemented - all documented in the README. The wall-clock overhead of the
              Python-loop scans is itself a finding, not an excuse.
            </p>
          </div>
        )}
        {lab.step < 5 && (
          <p className="min-h-[40px] text-sm leading-relaxed text-fog-mid" style={{ animation: "ddfade .6s" }}>
            <span className="mr-2 font-mono text-xs text-acc">{steps[lab.step].t}</span>
            {steps[lab.step].d}
            {lab.step === 2 && selToken !== null && (
              <span className="ml-2 inline-block rounded border border-acc/40 bg-acc/10 px-2 py-0.5 text-xs text-fog-hi">
                x{selToken + 1}: Δ, B, C computed from this token
              </span>
            )}
          </p>
        )}
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <LabControls lab={lab} />
      </div>
    </div>
  );
}
