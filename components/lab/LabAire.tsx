"use client";

import Image from "next/image";
import { LabControls, MeasuredBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 02 explainer: the AIRE lifecycle as an executable pipeline - ten
 * stages from query to report, each with its real readout. Pipeline nodes
 * are clickable (seek to that stage); the report stage shows the actual
 * live-run figure.
 */

const NODES = ["QUERY", "RETRIEVE", "RESPOND", "TRACE", "METRICS", "TAXONOMY", "REGRESSION", "REPORT"];
const NW = 130;
const NH = 46;
const POS = [
  [16, 26], [180, 26], [344, 26], [508, 26],
  [508, 148], [344, 148], [180, 148], [16, 148],
];

const AIRE_STEPS = [
  { n: 0, t: "Query", d: "A fixed 26-case JSONL suite goes in - 22 answerable, 4 unanswerable. Every run manifest stores the dataset's SHA-256." },
  { n: 1, t: "Retrieve", d: "Retrieval fetches evidence per case. The three-version experiment moves recall from 0.73 to 0.91 to 0.95 - measured, not estimated." },
  { n: 2, t: "Respond", d: "The responder answers. v1/v2 quote their evidence; v3 rewrites fluently and drops citations - the planted regression." },
  { n: 3, t: "Trace", d: "Each invocation persists as a schema-validated trace. Run once, replay forever: new metrics apply to old runs at zero API cost." },
  { n: 4, t: "Metrics", d: "The engine scores stored traces, never re-running the system: groundedness, citation coverage, abstention, recall@k / MRR." },
  { n: 5, t: "Taxonomy", d: "Failure taxonomy, first-match-wins: invocation error, abstention, ungrounded, incomplete, retrieval miss, success." },
  { n: 6, t: "Regression", d: "Direction-aware comparison catches the planted fluency regression: groundedness 0.57 falls to 0.00." },
  { n: 7, t: "Attribution", d: "Every regression ships with per-case attribution sorted worst-first - 17 specific cases caused the drop." },
  { n: 7, t: "Live run", d: "The same suite on live Gemini: abstention 0 to 1.0, grounding 1.0 - at 15.3 s/case vs 0.3 ms, 7.3x the tokens. The trade, measured." },
  { n: 7, t: "Report", d: "Static HTML report per run. The figure below is the actual live-vs-deterministic comparison from results/." },
];

export default function LabAire() {
  const lab = useLabSteps(AIRE_STEPS.length);
  const key = useLabKeyboard(lab);
  const step = lab.step;
  const cur = AIRE_STEPS[step];
  const packet = step > 0 ? center(Math.min(step, 7) - 1) : center(0);

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="AIRE evaluation pipeline lab: use space to play or pause, arrows to step, R to reset. Click any stage to jump to it."
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      <svg viewBox="0 0 640 216" className="lab-scene mx-auto w-full" role="img" aria-label="AIRE pipeline: query, retrieve, respond, trace, metrics, taxonomy, regression, report. Click a stage to jump.">
        {/* edges */}
        {NODES.slice(0, -1).map((_, i) => {
          const [x1, y1] = POS[i];
          const [x2, y2] = POS[i + 1];
          const activeEdge = step > i;
          const d =
            i === 3
              ? `M ${x1 + NW / 2} ${y1 + NH} L ${x1 + NW / 2} 106 L ${x2 + NW / 2} 106 L ${x2 + NW / 2} ${y2}`
              : i < 3
                ? `M ${x1 + NW} ${y1 + NH / 2} L ${x2} ${y2 + NH / 2}`
                : `M ${x1} ${y1 + NH / 2} L ${x2 + NW} ${y2 + NH / 2}`;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              className={activeEdge ? "edge-flow s-acc-dim" : "s-line"}
              strokeWidth={activeEdge ? 1.5 : 1}
            />
          );
        })}

        {/* traveling packet */}
        {step > 0 && step < 8 && (
          <circle
            r="4.5"
            className="f-acc"
            style={{
              transform: `translate(${packet[0]}px, ${packet[1]}px)`,
              transition: "transform .7s cubic-bezier(.22,.61,.21,1)",
            }}
          />
        )}

        {/* nodes (clickable: seek) */}
        {NODES.map((n, i) => {
          const [x, y] = POS[i];
          const active = Math.min(step, 7) === i && step <= 7;
          const done = step > i || step >= 8;
          return (
            <g key={n} className="cursor-pointer" onClick={() => lab.seek(i)}>
              <rect
                x={x}
                y={y}
                width={NW}
                height={NH}
                rx="10"
                className="f-node s-line"
                style={{
                  fill: active ? "rgb(var(--acc) / 0.14)" : done ? "rgb(var(--acc) / 0.05)" : undefined,
                  stroke: active ? "rgb(var(--acc) / 0.75)" : done ? "rgb(var(--acc) / 0.35)" : undefined,
                  transition: "fill .5s, stroke .5s",
                }}
              />
              <text
                x={x + NW / 2}
                y={y + NH / 2 + 4}
                textAnchor="middle"
                className={active || done ? "f-hi" : "f-mid"}
                fontSize="11.5"
                fontFamily="var(--font-mono)"
                letterSpacing="1"
              >
                {n}
              </text>
              <text x={x + 8} y={y - 6} className={done || active ? "f-acc" : "f-low"} fontSize="9" fontFamily="var(--font-mono)">
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}

        <text x="316" y="210" textAnchor="middle" className="f-mid" fontSize="11" fontFamily="var(--font-mono)">
          {READOUTS[Math.min(step, READOUTS.length - 1)]}
        </text>
      </svg>

      <div className="mt-3">
        {step === 6 && (
          <div className="mb-2 flex items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">v3_fluent_regression_vs_v1_baseline.json · 17-case attribution</span>
          </div>
        )}
        {step === 8 && (
          <div className="mb-2 flex items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">llm_eval_results.json · 17/26 clean · 6 quota errors recorded · 15.3 s vs 0.3 ms</span>
          </div>
        )}
        {step === 9 && (
          <div className="overflow-hidden rounded-xl border border-line bg-white" style={{ animation: "ddfade .6s" }}>
            <Image src="/projects/aire/aire_live.png" alt="Live Gemini versus deterministic v2: quality gains against log-scale operational cost" width={1100} height={430} className="h-auto w-full" />
          </div>
        )}
        <p className="min-h-[40px] text-sm leading-relaxed text-fog-mid" style={{ animation: "ddfade .6s" }}>
          <span className="mr-2 font-mono text-xs text-acc">{cur.t}</span>
          {cur.d}
        </p>
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <LabControls lab={lab} />
      </div>
    </div>
  );
}

const READOUTS: string[] = [
  "26 cases · 22 answerable · 4 unanswerable · dataset SHA-256 stored",
  "recall 0.73 (v1) → 0.91 (v2) → 0.95 (v3) · MRR 0.83",
  "v1/v2 quote evidence · v3 rewrites fluently (planted)",
  "manifest.json + traces.jsonl · schema-validated",
  "groundedness · citation coverage · abstention · recall@k / MRR",
  "invocation → abstention → ungrounded → incomplete → miss → success",
  "groundedness 0.57 → 0.00 · attributed to 17 cases",
  "worst-first: 17 citing cases dropped grounding to zero",
  "live Gemini: abstention 0→1.0 · grounding 1.0 · 15.3 s/case · 7.3x tokens",
  "static HTML report per run · figures from committed JSONs",
];

function center(i: number) {
  return [POS[i][0] + NW / 2, POS[i][1] + NH / 2];
}
