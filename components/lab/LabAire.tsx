"use client";

import { LabControls, MeasuredBadge, SchematicBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 02 explainer: the AIRE evaluation lifecycle, with the real
 * three-version experiment and live-run numbers as evidence.
 */

const NODES = [
  "QUERY",
  "RETRIEVE",
  "RESPOND",
  "TRACE",
  "METRICS",
  "TAXONOMY",
  "REGRESSION",
  "REPORT",
];

// snake layout: 4 top-left→right, then 4 bottom-right→left
const POS = [
  [14, 24], [178, 24], [342, 24], [506, 24],
  [506, 138], [342, 138], [178, 138], [14, 138],
];
const NW = 120;
const NH = 40;

export default function LabAire() {
  const STEPS = 8;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);

  const texts = [
    "A fixed 26-case JSONL suite goes in - 22 answerable, 4 unanswerable. Every run manifest stores the dataset's SHA-256.",
    "Retrieval fetches evidence for each case. Measured across versions: recall 0.73 (v1) → 0.91 (v2) → 0.95 (v3).",
    "The responder answers - faithfully quoting in v1/v2, fluently rewriting in v3. Fluency is the planted regression.",
    "Each invocation is persisted as a schema-validated trace: manifest.json + traces.jsonl. Run once, replay forever.",
    "The engine scores stored traces - never re-running the system: groundedness, citation coverage, abstention, recall@k / MRR.",
    "Every case lands in exactly one bucket: invocation error → abstention → ungrounded → incomplete → retrieval miss → success.",
    "Direction-aware comparison flags the planted regression: groundedness 0.57 → 0.00, attributed to 17 specific cases.",
    "Static HTML report. The live Gemini run on the same suite: abstention 0→1.0 and grounding 1.0 - at 15.3 s/case vs 0.3 ms.",
  ];

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="AIRE evaluation pipeline lab: use space to play or pause, arrows to step, R to reset"
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      <svg viewBox="0 0 640 210" className="w-full" role="img" aria-label="AIRE pipeline: query, retrieve, respond, trace, metrics, taxonomy, regression, report">
        {/* edges up to the active node */}
        {NODES.slice(0, -1).map((_, i) => {
          const [x1, y1] = POS[i];
          const [x2, y2] = POS[i + 1];
          const activeEdge = lab.step > i;
          const x1c = x1 + (i < 3 || i > 3 ? NW : 0);
          const x2c = x2 + (i === 3 ? NW : 0);
          const midY = (y1 + NH) / 2 + (y2 - y1) / 2;
          const d =
            i === 3
              ? `M ${x1 + NW / 2} ${y1 + NH} L ${x1 + NW / 2} ${81} L ${x2 + NW / 2} ${81} L ${x2 + NW / 2} ${y2}`
              : `M ${x1c} ${y1 + NH / 2} L ${x2c} ${y2 + NH / 2}`;
          void midY;
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
                rx="9"
                className="f-node"
                style={{
                  fill: active ? "rgb(var(--acc) / 0.12)" : undefined,
                  stroke: active ? "rgb(var(--acc) / 0.7)" : done ? "rgb(var(--acc) / 0.35)" : undefined,
                }}
              />
              <text
                x={x + NW / 2}
                y={y + NH / 2 + 4}
                textAnchor="middle"
                className={active || done ? "f-hi" : "f-mid"}
                fontSize="11"
                fontFamily="var(--font-mono)"
                letterSpacing="1"
              >
                {n}
              </text>
            </g>
          );
        })}
        <text x="14" y="205" className="f-low" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">
          {lab.step >= 3 ? "TRACES STORED · REPLAYABLE" : "26-CASE SUITE · DATASET HASHED"}
        </text>
      </svg>

      <div className="mt-3 min-h-[46px]">
        {lab.step === 6 && (
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">v2 vs v1 clean · v3 flagged · attribution worst-first</span>
          </div>
        )}
        {lab.step === 7 && (
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">17/26 clean · 6 quota errors recorded · 15.3 s vs 0.3 ms</span>
          </div>
        )}
        {lab.step === 1 && (
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">retrieval recall 0.73 → 0.91 → 0.95 across v1/v2/v3</span>
          </div>
        )}
        {lab.step === 4 && (
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <SchematicBadge />
            <span className="text-xs text-fog-low">metric definitions live in code; the lexical groundedness proxy is documented as a proxy</span>
          </div>
        )}
        <p className="text-sm leading-relaxed text-fog-mid">{texts[lab.step]}</p>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <LabControls lab={lab} />
      </div>
    </div>
  );
}
