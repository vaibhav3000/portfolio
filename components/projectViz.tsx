"use client";

import { useMotionOK } from "@/components/useMotionOK";

/**
 * Bespoke SVG scenes for the three projects. Each has a base layer (always
 * visible) and a detail layer (annotation callouts, shown via the scene's
 * Structure toggle). On reveal, nodes pop in sequence and solid strokes draw
 * themselves (.pop / .draw driven by the wrapper's .is-in). SMIL pulses
 * render only when motion is welcome.
 */

const MONO = "var(--font-mono)";

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

function Detail({
  on,
  children,
}: {
  on: boolean;
  children: React.ReactNode;
}) {
  return (
    <g
      className="transition-opacity duration-500"
      style={{ opacity: on ? 1 : 0 }}
      aria-hidden={!on}
    >
      {children}
    </g>
  );
}

function Pulse({ path, dur, delay = 0 }: { path: string; dur: number; delay?: number }) {
  const motionOK = useMotionOK();
  if (!motionOK) return null;
  return (
    <circle r="2.4" className="f-acc" opacity="0.9">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

/* ------------------------------------------------------------------ */
/* Project 01: S4 → Mamba-3 architectural evolution                    */
/* ------------------------------------------------------------------ */

const STAGES = [
  { x: 100, name: "S4D", sub: "LTI · convolution" },
  { x: 280, name: "Mamba", sub: "selective SSM" },
  { x: 460, name: "Mamba-2", sub: "SSD · chunked" },
  { x: 620, name: "Mamba-3", sub: "complex-valued" },
];

export function MambaViz({ detail }: { detail: boolean }) {
  const w = 700;
  const nodeY = 110;
  return (
    <svg
      viewBox={`0 0 ${w} 430`}
      className="w-full"
      role="img"
      aria-label="Evolution from S4D to Mamba-3 with a long sequence flowing through"
    >
      {/* edges between stages */}
      {[0, 1, 2].map((i) => {
        const x1 = STAGES[i].x + 62;
        const x2 = STAGES[i + 1].x - 62;
        const d = `M ${x1} ${nodeY} L ${x2} ${nodeY}`;
        return (
          <g key={i} className="pop" style={rd(480 + i * 130)}>
            <path d={d} fill="none" strokeWidth="2" className="edge-flow s-acc-dim" />
            <Pulse path={d} dur={3.2} delay={i * 1.05} />
          </g>
        );
      })}

      {/* stage nodes */}
      {STAGES.map((s, i) => (
        <g key={s.name} className="pop" style={rd(i * 130)}>
          <rect
            x={s.x - 62}
            y={nodeY - 30}
            width="124"
            height="60"
            rx="10"
            className={`f-node ${s.name === "Mamba-3" ? "s-acc-dim" : "s-line"}`}
          />
          <text x={s.x} y={nodeY - 6} textAnchor="middle" className="f-hi" fontSize="16" fontFamily={MONO}>
            {s.name}
          </text>
          <text x={s.x} y={nodeY + 14} textAnchor="middle" className="f-low" fontSize="16" fontFamily={MONO} letterSpacing="1">
            {s.sub.toUpperCase()}
          </text>
        </g>
      ))}

      {/* long-context sequence strip */}
      <g>
        <line x1="40" y1="250" x2="660" y2="250" className="s-line draw" strokeWidth="2" style={{ ...rd(520), "--len": 620 } as React.CSSProperties} />
        {Array.from({ length: 44 }).map((_, i) => (
          <circle
            key={i}
            cx={40 + i * 14.1}
            cy={250}
            r={i > 36 ? 2.6 : 1.7}
            className={`pop ${i > 36 ? "f-acc" : "f-low"}`}
            opacity={i > 36 ? 0.8 : 0.5}
            style={rd(620 + Math.min(i * 14, 500))}
          />
        ))}
        <text x="40" y="286" className="f-low pop" fontSize="14" fontFamily={MONO} letterSpacing="1" style={rd(900)}>
          1K
        </text>
        <text x="660" y="286" textAnchor="end" className="f-acc-dim pop" fontSize="14" fontFamily={MONO} letterSpacing="1" style={rd(980)}>
          32K CONTEXT
        </text>
        {/* latency note anchored to the strip */}
        <text x="40" y="316" className="f-low pop" fontSize="14" fontFamily={MONO} letterSpacing="1" style={rd(1060)}>
          BENCHMARKED AT EVERY OCTAVE · RTX 4050 · 6 GB
        </text>
      </g>

      {/* capability comparison */}
      <g>
        <text x="40" y="368" className="f-low pop" fontSize="14" fontFamily={MONO} letterSpacing="1" style={rd(1100)}>
          SELECTIVE COPYING
        </text>
        <rect x="200" y="358" width={134 * 0.06 * 3.2} height="10" rx="3" className="f-dim pop" style={rd(1180)} />
        <rect x="200" y="378" width={134 * 0.67 * 3.2} height="10" rx="3" className="f-acc-dim pop" style={rd(1260)} />
        <text x="200" y="352" className="f-low pop" fontSize="16" fontFamily={MONO} style={rd(1180)}>
          LTI S4D 6%
        </text>
        <text x="200" y="404" className="f-mid pop" fontSize="16" fontFamily={MONO} style={rd(1260)}>
          SELECTIVE SSM 67%
        </text>
      </g>

      <Detail on={detail}>
        <line x1="100" y1="150" x2="100" y2="200" className="s-line" strokeDasharray="2 3" />
        <text x="100" y="216" textAnchor="middle" className="f-mid" fontSize="13.5" fontFamily={MONO}>
          PARITY ≤56% (REAL TRANSITIONS)
        </text>
        <line x1="620" y1="150" x2="620" y2="200" className="s-acc-dim" strokeDasharray="2 3" />
        <text x="620" y="216" textAnchor="middle" className="f-acc" fontSize="13.5" fontFamily={MONO}>
          PARITY 98.3% · COMPLEX TRANSITIONS
        </text>
        <text x="620" y="34" textAnchor="middle" className="f-low" fontSize="16" fontFamily={MONO} letterSpacing="1">
          TEST-VERIFIED CHUNKED SSD PATH
        </text>
        <line x1="560" y1="40" x2="600" y2="78" className="s-line" strokeDasharray="2 3" />
      </Detail>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Project 02: AIRE evaluation pipeline                                */
/* ------------------------------------------------------------------ */

const PIPE = ["INPUT", "RETRIEVAL", "EVALUATION", "REGRESSION", "ATTRIBUTION"];

export function AireViz({ detail }: { detail: boolean }) {
  const xs = 120;
  const y0 = 60;
  const gap = 78;
  return (
    <svg
      viewBox="0 0 700 430"
      className="w-full"
      role="img"
      aria-label="Evaluation pipeline from input to attribution beside a regression trace"
    >
      {/* pipeline nodes */}
      {PIPE.map((p, i) => {
        const y = y0 + i * gap;
        const d = i < PIPE.length - 1 ? `M ${xs} ${y + 22} L ${xs} ${y + gap - 22}` : "";
        return (
          <g key={p} className="pop" style={rd(i * 140)}>
            {d && (
              <>
                <path d={d} fill="none" strokeWidth="2" className="edge-flow s-acc-dim pop" style={rd(260 + i * 140)} />
                <Pulse path={d} dur={4.6} delay={i * 0.9} />
              </>
            )}
            <rect
              x={xs - 70}
              y={y - 22}
              width="140"
              height="44"
              rx="9"
              className={`f-node ${p === "REGRESSION" ? "s-acc-dim" : "s-line"}`}
            />
            <text x={xs} y={y + 4} textAnchor="middle" className="f-hi" fontSize="15" fontFamily={MONO} letterSpacing="1.5">
              {p}
            </text>
          </g>
        );
      })}

      {/* groundedness regression chart */}
      <g>
        <line x1="300" y1="330" x2="660" y2="330" className="s-line pop" style={rd(420)} />
        <line x1="300" y1="330" x2="300" y2="60" className="s-line pop" style={rd(480)} />
        <polyline
          points="320,167 480,167 620,330"
          fill="none"
          className="s-hi draw"
          strokeWidth="2.2"
          style={{ ...rd(650), "--len": 430 } as React.CSSProperties}
        />
        <circle cx="480" cy="167" r="3.4" className="f-acc pop" style={rd(1150)} />
        <circle cx="620" cy="330" r="7" fill="none" className="s-hi pop" strokeWidth="1.8" opacity="0.7" style={rd(1350)} />
        <circle cx="620" cy="330" r="3" className="f-acc pop" style={rd(1350)} />
        <text x="320" y="152" className="f-mid pop" fontSize="14" fontFamily={MONO} style={rd(1000)}>
          v2 · 0.57
        </text>
        <text x="620" y="352" textAnchor="end" className="f-acc pop" fontSize="14" fontFamily={MONO} style={rd(1400)}>
          v3 · 0.00
        </text>
        <text x="300" y="48" className="f-low pop" fontSize="13.5" fontFamily={MONO} letterSpacing="1.5" style={rd(900)}>
          GROUNDEDNESS · FLAGGED REGRESSION
        </text>
        {/* abstention recovery */}
        <polyline points="320,330 480,330 620,120" fill="none" className="s-line-strong pop" strokeWidth="1.8" strokeDasharray="3 4" style={rd(1050)} />
        <text x="480" y="352" textAnchor="middle" className="f-low pop" fontSize="14" fontFamily={MONO} style={rd(1450)}>
          v3 fix · abstention 0.0 → 1.0
        </text>
        <text x="320" y="376" className="f-low pop" fontSize="13.5" fontFamily={MONO} letterSpacing="1" style={rd(1500)}>
          26-CASE SUITE · 15 S/CASE WITH LIVE RESPONDER
        </text>
      </g>

      <Detail on={detail}>
        <g fontSize="13.5" fontFamily={MONO} className="f-mid">
          <text x="212" y="66">groundedness</text>
          <text x="212" y="144">citation coverage</text>
          <text x="212" y="222">retrieval recall · MRR</text>
          <text x="212" y="300">failure taxonomy</text>
        </g>
        {[66, 144, 222, 300].map((y) => (
          <line key={y} x1="200" y1={y - 3} x2="212" y2={y - 3} className="s-line" strokeDasharray="2 3" />
        ))}
        <text x="620" y="90" className="f-low" fontSize="16" fontFamily={MONO} letterSpacing="1">
          DIRECTION-AWARE,
        </text>
        <text x="620" y="106" className="f-low" fontSize="16" fontFamily={MONO} letterSpacing="1">
          PER-CASE ATTRIBUTION
        </text>
      </Detail>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Project 03: agent state ring                                        */
/* ------------------------------------------------------------------ */

const SEGMENTS = ["PLAN", "ACT", "OBSERVE", "VERIFY"];

export function AgentViz({ detail }: { detail: boolean }) {
  const cx = 350;
  const cy = 215;
  const r = 118;
  const motionOK = useMotionOK();

  // ring path for the traveling pulse
  const ringPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`;

  return (
    <svg
      viewBox="0 0 700 430"
      className="w-full"
      role="img"
      aria-label="State-machine ring of plan, act, observe, verify inside a sandbox boundary"
    >
      {/* sandbox boundary */}
      <circle cx={cx} cy={cy} r="176" fill="none" className="s-acc-dim pop" strokeWidth="2" strokeDasharray="2 7" opacity="0.55" style={rd(0)} />
      <text x={cx} y={cy - 186} textAnchor="middle" className="f-low pop" fontSize="13.5" fontFamily={MONO} letterSpacing="2" style={rd(150)}>
        SANDBOX BOUNDARY
      </text>

      {/* ring segments */}
      <circle cx={cx} cy={cy} r={r} fill="none" className="s-line draw" strokeWidth="2" style={{ ...rd(250), "--len": 742 } as React.CSSProperties} />

      {/* rotating highlight: a 90 degree acc arc */}
      <g
        className="pop"
        style={{
          ...(motionOK
            ? { transformOrigin: `${cx}px ${cy}px`, animation: "ring-spin 9s linear infinite" }
            : {}),
          ...rd(900),
        }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          className="s-hi"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="14 86"
          opacity="0.85"
        />
      </g>

      {/* segment labels */}
      {SEGMENTS.map((s, i) => {
        const angle = -90 + i * 90 + 45; // centers of four quadrants
        const rad = (angle * Math.PI) / 180;
        const lx = cx + Math.cos(rad) * (r + 30);
        const ly = cy + Math.sin(rad) * (r + 30);
        return (
          <text
            key={s}
            x={lx}
            y={ly + 3}
            textAnchor="middle"
            className="f-hi pop"
            fontSize="15"
            fontFamily={MONO}
            letterSpacing="2"
            style={rd(480 + i * 120)}
          >
            {s}
          </text>
        );
      })}

      {/* center node */}
      <g className="pop" style={rd(820)}>
        <circle cx={cx} cy={cy} r="46" className="f-node s-line" />
        <text x={cx} y={cy - 6} textAnchor="middle" className="f-hi" fontSize="14" fontFamily={MONO} letterSpacing="1">
          STATE
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="f-hi" fontSize="14" fontFamily={MONO} letterSpacing="1">
          MACHINE
        </text>
        <text x={cx} y={cy + 26} textAnchor="middle" className="f-low" fontSize="16" fontFamily={MONO}>
          DECIDES, NOT THE MODEL
        </text>
      </g>

      {/* seven tools on an inner orbit */}
      <g className="pop" style={rd(1000)}>
        {Array.from({ length: 7 }).map((_, i) => {
          const ang = (-90 + i * (360 / 7)) * (Math.PI / 180);
          const tr = 76;
          return (
            <circle
              key={i}
              cx={cx + Math.cos(ang) * tr}
              cy={cy + Math.sin(ang) * tr}
              r="2.6"
              className="f-mid"
            />
          );
        })}
      </g>
      <text x={cx} y={cy + 76 + 46} textAnchor="middle" className="f-low pop" fontSize="13.5" fontFamily={MONO} letterSpacing="1.5" style={rd(1080)}>
        7 VALIDATED TOOLS
      </text>

      <Pulse path={ringPath} dur={7.5} />

      <Detail on={detail}>
        <text x={cx} y={cy + 205} textAnchor="middle" className="f-mid" fontSize="13.5" fontFamily={MONO} letterSpacing="1">
          SCHEMA CHECKS · AUTO / ASK / DENY · COMMAND ALLOWLISTS
        </text>
        <text x={cx + r + 42} y={cy - 4} className="f-low" fontSize="16" fontFamily={MONO}>
          COMPLETION REQUIRES
        </text>
        <text x={cx + r + 42} y={cy + 12} className="f-low" fontSize="16" fontFamily={MONO}>
          GREEN TEST EVIDENCE
        </text>
        <line x1={cx + r + 4} y1={cy + 2} x2={cx + r + 36} y2={cy + 2} className="s-line" strokeDasharray="2 3" />
      </Detail>
    </svg>
  );
}
