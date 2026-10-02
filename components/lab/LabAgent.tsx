"use client";

import { LabControls, MeasuredBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 03 explainer: a loop diagram - the planner proposes on the left,
 * proposals travel through the runtime's VALIDATE and JAIL gates into the
 * PLAN→ACT→OBSERVE→VERIFY cycle, VERIFY runs the test suite, and the exit
 * code alone opens COMPLETE (with the measured REPLAN branch shown).
 */

const LOOP = { x: 300, y: 34, w: 330, h: 210 }; // loop area
const CN = { PLAN: [LOOP.x, LOOP.y], ACT: [LOOP.x + LOOP.w - 84, LOOP.y], OBSERVE: [LOOP.x + LOOP.w - 84, LOOP.y + LOOP.h - 40], VERIFY: [LOOP.x, LOOP.y + LOOP.h - 40] };
const NW = 84;
const NH = 34;

export default function LabAgent() {
  const STEPS = 8;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);

  const texts = [
    "The LLM planner proposes exactly one tool call - a suggestion. It never executes anything itself.",
    "GATE 1 - ToolSpec.validate: schema checked. Malformed calls return as rejected observations; the loop never crashes.",
    "GATE 2 - workspace path jail: the resolved path must sit inside the workspace. ../ and drive letters are rejected.",
    "ACT: the runtime executes the validated tool - read, search, apply_edit, git_diff, or the allowlisted test command.",
    "OBSERVE: the result returns as an observation and enters the agent's history as data, never as instructions.",
    "VERIFY: the full test suite re-runs. Completion is decided by the exit code - not by the model's confidence.",
    "First attempt failed on the benchmark's tax task: the machine transitions to REPLAN and the planner retries once.",
    "Green tests open COMPLETE - reachable only from VERIFY. Same gates for the scripted planner and live Gemini.",
  ];

  const nodeActive = (s: string) =>
    (s === "PLAN" && (lab.step === 0 || lab.step === 6)) ||
    (s === "ACT" && lab.step === 3) ||
    (s === "OBSERVE" && lab.step === 4) ||
    (s === "VERIFY" && (lab.step === 5 || lab.step === 7));

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="Agent loop lab: use space to play or pause, arrows to step, R to reset"
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      <svg viewBox="0 0 640 300" className="lab-scene w-full" role="img" aria-label="Planner proposes; proposals pass validate and jail gates into the plan-act-observe-verify loop; completion requires green tests">
        {/* planner */}
        <rect x="16" y="108" width="150" height="72" rx="10" fill="none" className={lab.step === 0 || lab.step === 6 ? "s-line-strong" : "s-line"} style={{ strokeDasharray: "5 4" }} />
        <text x="91" y="132" textAnchor="middle" className="f-low" fontSize="9.5" fontFamily="var(--font-mono)" letterSpacing="1.5">
          LLM PLANNER
        </text>
        <text x="91" y="150" textAnchor="middle" className="f-hi" fontSize="11.5" fontFamily="var(--font-mono)">
          proposes only
        </text>
        {(lab.step === 0 || lab.step === 6) && (
          <g style={{ animation: "ddfade .6s" }}>
            <rect x="34" y="160" width="114" height="14" rx="4" className="f-node" />
            <text x="91" y="170" textAnchor="middle" className="f-hi" fontSize="8.5" fontFamily="var(--font-mono)">
              apply_edit(cart.py)
            </text>
          </g>
        )}

        {/* gates */}
        {(["VALIDATE", "JAIL"] as const).map((g, gi) => {
          const gx = 205;
          const gy = 108 + gi * 42;
          const gateStep = lab.step >= gi + 1;
          return (
            <g key={g}>
              <rect x={gx} y={gy} width="76" height="30" rx="7" className="f-node" style={{ stroke: gateStep ? "rgb(var(--acc) / 0.6)" : "rgb(var(--fog-mid) / 0.45)", fill: gateStep ? "rgb(var(--acc) / 0.08)" : undefined, transition: "all .5s" }} />
              <text x={gx + 38} y={gy + 19} textAnchor="middle" className={gateStep ? "f-hi" : "f-low"} fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1">
                {g}
              </text>
              <text x={gx + 82} y={gy + 19} className={gateStep ? "f-acc" : "f-low"} fontSize="10" fontFamily="var(--font-mono)">
                {gateStep ? "✓" : "·"}
              </text>
            </g>
          );
        })}
        <path d="M 166 144 L 205 123" fill="none" className={lab.step >= 1 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d="M 281 144 L 300 144" fill="none" className={lab.step >= 1 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />

        {/* loop edges */}
        <path d={`M ${CN.PLAN[0] + NW} ${CN.PLAN[1] + NH / 2} L ${CN.ACT[0]} ${CN.ACT[1] + NH / 2}`} fill="none" className={lab.step === 3 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d={`M ${CN.ACT[0] + NW / 2} ${CN.ACT[1] + NH} L ${CN.OBSERVE[0] + NW / 2} ${CN.OBSERVE[1]}`} fill="none" className={lab.step === 4 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d={`M ${CN.OBSERVE[0]} ${CN.OBSERVE[1] + NH / 2} L ${CN.VERIFY[0] + NW} ${CN.VERIFY[1] + NH / 2}`} fill="none" className={lab.step >= 5 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d={`M ${CN.VERIFY[0] + NW / 2} ${CN.VERIFY[1]} L ${CN.PLAN[0] + NW / 2} ${CN.PLAN[1] + NH}`} fill="none" className={lab.step === 6 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" strokeDasharray={lab.step === 6 ? undefined : "3 4"} />

        {/* loop nodes */}
        {Object.entries(CN).map(([name, [x, y]]) => {
          const active = nodeActive(name);
          return (
            <g key={name}>
              <rect x={x} y={y} width={NW} height={NH} rx="9" className="f-node" style={{ stroke: active ? "rgb(var(--acc) / 0.8)" : "rgb(var(--fog-mid) / 0.45)", fill: active ? "rgb(var(--acc) / 0.12)" : undefined, transition: "all .5s" }} />
              <text x={x + NW / 2} y={y + NH / 2 + 4} textAnchor="middle" className={active ? "f-hi" : "f-mid"} fontSize="10.5" fontFamily="var(--font-mono)" letterSpacing="1">
                {name}
              </text>
            </g>
          );
        })}

        {/* COMPLETE + REPLAN badges */}
        <g style={{ opacity: lab.step === 7 ? 1 : 0.3, transition: "opacity .5s" }}>
          <rect x={CN.VERIFY[0] + 16} y={CN.VERIFY[1] - 46} width={NW - 32} height={NH - 6} rx="9" className="f-node" style={{ stroke: lab.step === 7 ? "rgb(var(--acc) / 0.8)" : "rgb(var(--fog-mid) / 0.45)", fill: lab.step === 7 ? "rgb(var(--acc) / 0.15)" : undefined }} />
          <text x={CN.VERIFY[0] + 16 + (NW - 32) / 2} y={CN.VERIFY[1] - 46 + 20} textAnchor="middle" className={lab.step === 7 ? "f-hi" : "f-low"} fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">
            COMPLETE
          </text>
          <path d={`M ${CN.VERIFY[0] + NW / 2} ${CN.VERIFY[1] - 12} L ${CN.VERIFY[0] + NW / 2} ${CN.VERIFY[1] - 14}`} className="s-acc-dim" strokeWidth="1.5" />
        </g>
        <g style={{ opacity: lab.step === 6 ? 1 : 0.3, transition: "opacity .5s" }}>
          <rect x="230" y="216" width="64" height="26" rx="8" className="f-node" style={{ stroke: lab.step === 6 ? "rgb(var(--acc) / 0.7)" : "rgb(var(--fog-mid) / 0.45)" }} />
          <text x="262" y="233" textAnchor="middle" className={lab.step === 6 ? "f-hi" : "f-low"} fontSize="9" fontFamily="var(--font-mono)">
            REPLAN
          </text>
        </g>

        {/* sandbox boundary */}
        <rect x="292" y="22" width="346" height="230" rx="14" fill="none" className={lab.step >= 2 ? "s-acc-dim" : "s-line"} strokeWidth="1" strokeDasharray="3 6" />
        <text x="465" y="16" textAnchor="middle" className={lab.step >= 2 ? "f-acc" : "f-low"} fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2" style={{ transition: "opacity .5s" }}>
          WORKSPACE JAIL
        </text>

        {/* test bar under VERIFY */}
        <g style={{ opacity: lab.step === 5 || lab.step === 7 ? 1 : 0, transition: "opacity .5s" }}>
          <rect x={CN.VERIFY[0]} y={CN.VERIFY[1] + 46} width={NW} height="6" rx="3" className="f-node" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              x={CN.VERIFY[0] + 2 + i * (NW / 6 - 1)}
              y={CN.VERIFY[1] + 48}
              width={NW / 6 - 4}
              height={2}
              rx="1"
              style={{
                fill: lab.step === 7 || i < 4 ? "rgb(var(--acc) / 0.8)" : "rgb(var(--fog-mid) / 0.35)",
                transition: `fill .4s ${i * 0.12}s`,
              }}
            />
          ))}
          <text x={CN.VERIFY[0] + NW / 2} y={CN.VERIFY[1] + 66} textAnchor="middle" className="f-low" fontSize="9" fontFamily="var(--font-mono)">
            {lab.step === 7 ? "12 passed · exit 0" : "running…"}
          </text>
        </g>
      </svg>

      <div className="mt-3 min-h-[110px]">
        {lab.step === 7 && (
          <div className="mb-3" style={{ animation: "ddfade .6s" }}>
            <div className="mb-2 flex items-center gap-3">
              <MeasuredBadge />
              <span className="text-xs text-fog-low">results/benchmark_results.json · llm_benchmark_results.json</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4">
              {[
                ["4/4", "SWE tasks, deterministic"],
                ["0", "failed tool calls"],
                ["2/2", "live Gemini tasks"],
                ["1", "measured replan (task 02)"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dd className="text-lg font-light tracking-tight text-fog-hi tabular-nums">{v}</dd>
                  <dt className="text-[10.5px] leading-snug text-fog-low">{l}</dt>
                </div>
              ))}
            </dl>
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
