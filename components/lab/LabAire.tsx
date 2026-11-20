"use client";

import { LabControls, MeasuredBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 02 explainer: the AIRE lifecycle as an executable pipeline - ten
 * stages from query to report, each with its real readout. Pipeline nodes
 * are clickable (seek to that stage); the gate and report stages show the
 * measured three-version comparison from results/.
 */

const NODES = ["QUERY", "RETRIEVE", "RESPOND", "TRACE", "METRICS", "TAXONOMY", "REGRESSION", "REPORT"];
const HUE = ["--teal", "--gold", "--teal", "--ok", "--gold", "--teal", "--warn", "--ok"];
const NW = 130;
const NH = 46;
const POS = [
  [16, 26], [180, 26], [344, 26], [508, 26],
  [508, 148], [344, 148], [180, 148], [16, 148],
];

const AIRE_STEPS = [
  { n: 0, t: "Query", d: "A fixed 150-case JSONL suite goes in: 130 answerable questions and 20 unanswerable ones. Every run manifest stores the dataset's SHA-256." },
  { n: 1, t: "Retrieve", d: "Retrieval fetches evidence per case. Recall@3 rises from 0.72 (v1, top 1) to 0.86 (v2, top 3); an ablation at a fixed K shows the gain is K, not IDF weighting." },
  { n: 2, t: "Respond", d: "The responder answers. v1 and v2 quote their evidence with citations; v3 rewrites fluently and drops every citation, the planted regression." },
  { n: 3, t: "Trace", d: "Each invocation is streamed to disk as a schema-validated trace. Run once, replay forever: new metrics apply to old runs at zero API cost." },
  { n: 4, t: "Metrics", d: "The engine scores stored traces, never re-running the system: groundedness, citation precision and recall, abstention, Recall@K and MRR, each mean with a seeded 95% bootstrap interval." },
  { n: 5, t: "Taxonomy", d: "Every failed case gets one class, blamed on the earliest stage that went wrong: invocation error, missed abstention, retrieval miss, tool error, wrong abstention, ungrounded, incomplete answer, answer mismatch." },
  { n: 6, t: "Regression", d: "The paired comparison catches the planted fluency regression: groundedness falls from 1.0 to 0.0 on all 130 answerable cases, McNemar's exact test with Holm adjustment." },
  { n: 7, t: "Attribution", d: "Every regression ships with per-case attribution: all 130 answerable cases for groundedness, 101 for gold citation recall." },
  { n: 7, t: "Gate", d: "A metric regresses only when the change is beyond tolerance and a paired test supports it. v2 passes with exit 0; v3 is blocked on 4 gated metrics with exit 1." },
  { n: 7, t: "Report", d: "A static HTML diff report per comparison. The table above holds the measured means from results/ with their 95% bootstrap intervals." },
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
              <rect x={x + 10} y={y} width="26" height="3" rx="1.5" style={{ fill: `rgb(var(${HUE[i]}) / 0.8)` }} />
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
              <text x={x + 8} y={y - 6} className={done || active ? "f-gold" : "f-low"} fontSize="9" fontFamily="var(--font-mono)">
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
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <MeasuredBadge />
            <span className="min-w-0 text-xs text-fog-low [overflow-wrap:anywhere]">v3_fluent_regression_vs_v1_baseline.json · 130-case attribution</span>
          </div>
        )}
        {step === 8 && (
          <div className="mb-3" style={{ animation: "ddfade .6s" }}>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <MeasuredBadge />
              <span className="text-xs text-fog-low">v2 and v3 comparison JSONs · paired tests · Holm-adjusted</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4">
              {[
                ["exit 0", "v2 vs v1: no regressions"],
                ["p < 0.001", "Recall@3 gain, paired bootstrap"],
                ["exit 1", "v3 vs v1: blocked"],
                ["4", "gated metrics regressed in v3"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dd className="text-lg font-light tracking-tight text-fog-hi tabular-nums">{v}</dd>
                  <dt className="text-[10.5px] leading-snug text-fog-low">{l}</dt>
                </div>
              ))}
            </dl>
          </div>
        )}
        {step === 9 && (
          <div className="mb-3" style={{ animation: "ddfade .6s" }}>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <MeasuredBadge />
              <span className="text-xs text-fog-low">results/*/eval_results.json · mean [95% CI] · n = 130 answerable</span>
            </div>
            <VersionTable />
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

/** Means and seeded 95% bootstrap intervals over the 130 answerable cases. */
type Cell = { mean: string; ci?: string };
const VERSIONS: { metric: string; values: [Cell, Cell, Cell] }[] = [
  {
    metric: "Recall@3",
    values: [
      { mean: "0.72", ci: "[0.64, 0.78]" },
      { mean: "0.86", ci: "[0.80, 0.91]" },
      { mean: "0.86", ci: "[0.80, 0.91]" },
    ],
  },
  { metric: "Groundedness", values: [{ mean: "1.0" }, { mean: "1.0" }, { mean: "0.0" }] },
  {
    metric: "Gold citation recall",
    values: [{ mean: "0.72", ci: "[0.64, 0.78]" }, { mean: "0.72", ci: "[0.64, 0.78]" }, { mean: "0.0" }],
  },
];

function VersionTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[300px] border-collapse text-left text-[12px]">
        <thead>
          <tr className="border-b border-line">
            {["Metric", "v1", "v2", "v3"].map((c) => (
              <th key={c} scope="col" className="py-1.5 pr-4 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-fog-low">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VERSIONS.map((r) => (
            <tr key={r.metric} className="border-b border-line">
              <th scope="row" className="py-1.5 pr-4 font-normal text-fog-hi">
                {r.metric}
              </th>
              {r.values.map((v, i) => (
                <td key={i} className="whitespace-nowrap py-1.5 pr-4 align-top tabular-nums">
                  <span className={i === 2 && v.mean === "0.0" ? "text-warn" : "text-fog-mid"}>{v.mean}</span>
                  {v.ci && <span className="block text-[10.5px] text-fog-low">{v.ci}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const READOUTS: string[] = [
  "150 cases · 130 answerable · 20 unanswerable · dataset SHA-256 stored",
  "Recall@3 0.72 (v1) → 0.86 (v2) → 0.86 (v3) · MRR@3 0.78 → 0.82",
  "v1/v2 quote evidence · v3 rewrites fluently (planted)",
  "manifest.json + traces.jsonl · streamed · schema-validated",
  "groundedness · citations · abstention · Recall@K / MRR · 95% CIs",
  "invocation → abstention → miss → tool → ungrounded → incomplete",
  "groundedness 1.0 → 0.0 · McNemar, Holm-adjusted p < 0.001",
  "attribution: 130 cases (groundedness) · 101 (gold citations)",
  "v2: exit 0 · v3: exit 1, blocked on 4 gated metrics",
  "static HTML diff report · numbers from committed JSONs",
];

function center(i: number) {
  return [POS[i][0] + NW / 2, POS[i][1] + NH / 2];
}
