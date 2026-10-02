"use client";

import Image from "next/image";
import { LabControls, MeasuredBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 02 explainer: the AIRE lifecycle as an executable pipeline - a
 * data packet travels stage to stage, each stage shows its real readout,
 * and the report step shows the actual live-run figure.
 */

const NODES = ["QUERY", "RETRIEVE", "RESPOND", "TRACE", "METRICS", "TAXONOMY", "REGRESSION", "REPORT"];
const NW = 130;
const NH = 46;
const POS = [
  [16, 26], [180, 26], [344, 26], [508, 26],
  [508, 148], [344, 148], [180, 148], [16, 148],
];

const center = (i: number) => [POS[i][0] + NW / 2, POS[i][1] + NH / 2];

const READOUTS: Record<number, string> = {
  0: "26 cases · 22 answerable · 4 unanswerable · dataset SHA-256 stored",
  1: "recall 0.73 (v1) → 0.91 (v2) → 0.95 (v3) · MRR 0.83",
  2: "v1/v2 quote evidence · v3 rewrites fluently (planted)",
  3: "manifest.json + traces.jsonl · schema-validated",
  4: "groundedness · citation coverage · abstention · recall@k / MRR",
  5: "invocation → abstention → ungrounded → incomplete → miss → success",
  6: "groundedness 0.57 → 0.00 · attributed to 17 cases",
  7: "17/26 clean · abstention 0→1.0 · 15.3 s vs 0.3 ms",
};

export default function LabAire() {
  const STEPS = 8;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);
  const packet = lab.step > 0 ? center(lab.step - 1) : center(0);

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="AIRE evaluation pipeline lab: use space to play or pause, arrows to step, R to reset"
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      <svg viewBox="0 0 640 216" className="lab-scene w-full" role="img" aria-label="AIRE pipeline: query, retrieve, respond, trace, metrics, taxonomy, regression, report">
        {/* edges */}
        {NODES.slice(0, -1).map((_, i) => {
          const [x1, y1] = POS[i];
          const [x2, y2] = POS[i + 1];
          const activeEdge = lab.step > i;
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
        {lab.step > 0 && (
          <circle
            r="4.5"
            className="f-acc"
            style={{
              transform: `translate(${packet[0]}px, ${packet[1]}px)`,
              transition: "transform .7s cubic-bezier(.22,.61,.21,1)",
            }}
          />
        )}

        {/* nodes */}
        {NODES.map((n, i) => {
          const [x, y] = POS[i];
          const active = lab.step === i;
          const done = lab.step > i;
          return (
            <g key={n}>
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
          {READOUTS[lab.step]}
        </text>
      </svg>

      <div className="mt-3 min-h-[132px]">
        {[1, 6, 7].includes(lab.step) && (
          <div className="mb-2 flex items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">
              {lab.step === 1
                ? "results/*/eval_results.json"
                : lab.step === 6
                  ? "v3_fluent_regression_vs_v1_baseline.json"
                  : "llm_eval_results.json · llm_vs_deterministic.json"}
            </span>
          </div>
        )}
        {lab.step === 7 && (
          <div className="overflow-hidden rounded-xl border border-line bg-white" style={{ animation: "ddfade .6s" }}>
            <Image src="/projects/aire/aire_live.png" alt="Live Gemini versus deterministic v2: quality gains against log-scale operational cost" width={1100} height={430} className="h-auto w-full" />
          </div>
        )}
        <p className="text-sm leading-relaxed text-fog-mid">
          {lab.step === 0 && "A fixed 26-case JSONL suite goes in - 22 answerable, 4 unanswerable. Every run manifest stores the dataset's SHA-256."}
          {lab.step === 1 && "Retrieval fetches evidence per case. The three-version experiment moves recall from 0.73 to 0.91 - measured, not estimated."}
          {lab.step === 2 && "The responder answers. v1/v2 quote their evidence; v3 rewrites fluently and drops citations - the planted regression."}
          {lab.step === 3 && "Each invocation persists as a schema-validated trace. Run once, replay forever: new metrics apply to old runs at zero API cost."}
          {lab.step === 4 && "The engine scores stored traces, never re-running the system: groundedness, citation coverage, abstention, recall@k / MRR."}
          {lab.step === 5 && "Failure taxonomy, first-match-wins: invocation error → abstention → ungrounded → incomplete → retrieval miss → success."}
          {lab.step === 6 && "Direction-aware regression catches the planted fluency regression: groundedness 0.57 → 0.00 with per-case attribution."}
          {lab.step === 7 && "Static report. The live Gemini run on the same suite fixed abstention and grounding - the cost panel shows the trade."}
        </p>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <LabControls lab={lab} />
      </div>
    </div>
  );
}
