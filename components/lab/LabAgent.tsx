"use client";

import { LabControls, MeasuredBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 03 explainer: the full agent loop - analyze, plan through the
 * validate/jail gates, act, observe, verify, the measured REPLAN branch,
 * and test-proven completion. State chips and nodes are clickable (seek).
 */

const STATES = ["ANALYZE", "PLAN", "ACT", "OBSERVE", "VERIFY", "COMPLETE"];
const LOOP = { x: 300, y: 60, w: 330, h: 190 };
const CN: Record<string, [number, number]> = {
  PLAN: [LOOP.x, LOOP.y],
  ACT: [LOOP.x + LOOP.w - 84, LOOP.y],
  OBSERVE: [LOOP.x + LOOP.w - 84, LOOP.y + LOOP.h - 38],
  VERIFY: [LOOP.x, LOOP.y + LOOP.h - 38],
};
const NW = 84;
const NH = 32;

// step -> which loop node is active
const STEP_NODE: Record<number, string> = { 0: "ANALYZE", 1: "PLAN", 4: "ACT", 5: "OBSERVE", 6: "VERIFY", 8: "VERIFY", 9: "COMPLETE" };

export default function LabAgent() {
  const STEPS = 10;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);
  const step = lab.step;

  const steps = [
    { t: "ANALYZE", d: "The runtime inventories the target repo - file tree, tests, entry points - fully inside the workspace jail. The planner sees only the summary.", node: "ANALYZE" },
    { t: "PLAN", d: "The LLM planner proposes exactly one tool call - a suggestion. It never executes anything itself.", node: "PLAN" },
    { t: "VALIDATE", d: "GATE 1 - ToolSpec.validate: schema checked. Malformed calls return as rejected observations; the loop never crashes.", node: "PLAN" },
    { t: "JAIL", d: "GATE 2 - workspace path jail: the resolved path must sit inside the workspace. ../ and drive letters are rejected.", node: "PLAN" },
    { t: "ACT", d: "The runtime executes the validated tool - read, search, apply_edit, git_diff, or the allowlisted test command.", node: "ACT" },
    { t: "OBSERVE", d: "The result returns as an observation and enters the agent's history as data, never as instructions.", node: "OBSERVE" },
    { t: "VERIFY", d: "The full test suite re-runs. Completion is decided by the exit code - not by the model's confidence.", node: "VERIFY" },
    { t: "REPLAN", d: "First attempt failed on the benchmark's tax task: the machine transitions to REPLAN and the planner retries once.", node: "PLAN" },
    { t: "VERIFY again", d: "Second pass runs the suite fresh - no cached results, no trust carried over from the failed attempt.", node: "VERIFY" },
    { t: "COMPLETE", d: "Green tests open COMPLETE - reachable only from VERIFY. Benchmark: 4/4 tasks, 0 failed tool calls; live Gemini 2/2.", node: "COMPLETE" },
  ];
  const cur = steps[step];

  const nodeActive = (s: string) => (STEP_NODE[step] ?? "") === s;

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="Agent loop lab: use space to play or pause, arrows to step, R to reset. Click a stage chip to jump."
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      {/* state chips (clickable: seek) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATES.map((s, i) => {
          const active = nodeActive(s);
          const seek = [0, 1, 4, 5, 6, 9][i];
          const isComplete = s === "COMPLETE";
          return (
            <button
              key={s}
              type="button"
              onClick={() => lab.seek(seek)}
              className={`cursor-pointer rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors duration-300 ${
                active && !isComplete
                  ? "border-fog-mid/50 bg-ink-900 text-fog-hi"
                  : "border-line text-fog-low/70 hover:text-fog-mid"
              }`}
              style={
                active && isComplete
                  ? { borderColor: "rgb(var(--ok) / 0.7)", background: "rgb(var(--ok) / 0.1)", color: "rgb(var(--fog-hi))" }
                  : undefined
              }
            >
              {s}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => lab.seek(7)}
          className={`cursor-pointer rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors duration-300 ${
            step === 7 ? "text-warn" : "border-line text-fog-low/70 hover:text-fog-mid"
          }`}
          style={step === 7 ? { borderColor: "rgb(var(--warn) / 0.7)", background: "rgb(var(--warn) / 0.1)", color: "rgb(var(--warn))" } : undefined}
        >
          REPLAN
        </button>
      </div>

      <svg viewBox="0 0 640 268" className="lab-scene mx-auto mt-3 w-full" role="img" aria-label="Planner proposes; proposals pass validate and jail gates into the plan-act-observe-verify loop; completion requires green tests">
        {/* planner */}
        <rect x="16" y="96" width="150" height="72" rx="10" fill="none" className={step === 1 || step === 2 || step === 7 ? "s-line-strong" : "s-line"} style={{ strokeDasharray: "5 4" }} />
        <text x="91" y="120" textAnchor="middle" className="f-low" fontSize="9.5" fontFamily="var(--font-mono)" letterSpacing="1.5">
          LLM PLANNER
        </text>
        <text x="91" y="138" textAnchor="middle" className="f-hi" fontSize="11.5" fontFamily="var(--font-mono)">
          proposes only
        </text>
        {(step === 1 || step === 7) && (
          <g style={{ animation: "ddfade .6s" }}>
            <rect x="34" y="148" width="114" height="14" rx="4" className="f-node" />
            <text x="91" y="158" textAnchor="middle" className="f-hi" fontSize="8.5" fontFamily="var(--font-mono)">
              apply_edit(cart.py)
            </text>
          </g>
        )}

        {/* gates */}
        {(["VALIDATE", "JAIL"] as const).map((gate, gi) => {
          const gx = 205;
          const gy = 96 + gi * 42;
          const gateStep = step >= gi + 2;
          return (
            <g key={gate}>
              <rect x={gx} y={gy} width="76" height="30" rx="7" className="f-node" style={{ stroke: gateStep ? "rgb(var(--acc) / 0.6)" : "rgba(226,232,240,0.18)", fill: gateStep ? "rgb(var(--acc) / 0.08)" : undefined, transition: "all .5s" }} />
              <text x={gx + 38} y={gy + 19} textAnchor="middle" className={gateStep ? "f-hi" : "f-low"} fontSize="9" fontFamily="var(--font-mono)" letterSpacing="1">
                {gate}
              </text>
              <text x={gx + 82} y={gy + 19} className={gateStep ? "f-ok" : "f-low"} fontSize="10" fontFamily="var(--font-mono)">
                {gateStep ? "✓" : "·"}
              </text>
            </g>
          );
        })}
        <path d="M 166 132 L 205 111" fill="none" className={step >= 2 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d="M 281 132 L 300 132" fill="none" className={step >= 2 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />

        {/* loop edges */}
        <path d={`M ${CN.PLAN[0] + NW} ${CN.PLAN[1] + NH / 2} L ${CN.ACT[0]} ${CN.ACT[1] + NH / 2}`} fill="none" className={step === 4 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d={`M ${CN.ACT[0] + NW / 2} ${CN.ACT[1] + NH} L ${CN.OBSERVE[0] + NW / 2} ${CN.OBSERVE[1]}`} fill="none" className={step === 5 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d={`M ${CN.OBSERVE[0]} ${CN.OBSERVE[1] + NH / 2} L ${CN.VERIFY[0] + NW} ${CN.VERIFY[1] + NH / 2}`} fill="none" className={step >= 6 ? "edge-flow s-acc-dim" : "s-line"} strokeWidth="1.5" />
        <path d={`M ${CN.VERIFY[0] + NW / 2} ${CN.VERIFY[1]} L ${CN.PLAN[0] + NW / 2} ${CN.PLAN[1] + NH}`} fill="none" className={step === 7 ? "edge-flow s-warn" : "s-line"} strokeWidth="1.5" strokeDasharray={step === 7 ? undefined : "3 4"} />

        {/* loop nodes (clickable: seek to the matching step) */}
        {Object.entries(CN).map(([name, [x, y]]) => {
          const active = nodeActive(name);
          const seekStep = name === "PLAN" ? 1 : name === "ACT" ? 4 : name === "OBSERVE" ? 5 : 6;
          return (
            <g key={name} className="cursor-pointer" onClick={() => lab.seek(seekStep)}>
              <rect x={x} y={y} width={NW} height={NH} rx="9" className="f-node" style={{ stroke: active ? "rgb(var(--acc) / 0.8)" : "rgba(226,232,240,0.18)", fill: active ? "rgb(var(--acc) / 0.12)" : undefined, transition: "all .5s" }} />
              <text x={x + NW / 2} y={y + NH / 2 + 4} textAnchor="middle" className={active ? "f-hi" : "f-mid"} fontSize="10.5" fontFamily="var(--font-mono)" letterSpacing="1">
                {name}
              </text>
            </g>
          );
        })}

        {/* COMPLETE badge */}
        <g style={{ opacity: step === 9 ? 1 : 0.3, transition: "opacity .5s" }}>
          <rect x={CN.VERIFY[0] + 12} y={CN.VERIFY[1] - 44} width={NW - 24} height={NH - 4} rx="9" className="f-node" style={{ stroke: step === 9 ? "rgb(var(--ok) / 0.85)" : "rgba(226,232,240,0.18)", fill: step === 9 ? "rgb(var(--ok) / 0.14)" : undefined }} />
          <text x={CN.VERIFY[0] + 12 + (NW - 24) / 2} y={CN.VERIFY[1] - 44 + 19} textAnchor="middle" className={step === 9 ? "f-ok" : "f-low"} fontSize="9.5" fontFamily="var(--font-mono)" letterSpacing="1">
            COMPLETE
          </text>
        </g>

        {/* sandbox boundary */}
        <rect x="292" y="48" width="346" height="216" rx="14" fill="none" className={step >= 3 ? "s-acc-dim" : "s-line"} strokeWidth="1" strokeDasharray="3 6" />
        <text x="465" y="42" textAnchor="middle" className={step >= 3 ? "f-acc" : "f-low"} fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2">
          WORKSPACE JAIL
        </text>

        {/* analyze file chips (step 0) */}
        {step === 0 && (
          <g style={{ animation: "ddfade .6s" }}>
            {["shop/", "billing/", "tests/"].map((f, i) => (
              <g key={f}>
                <rect x={320 + i * 104} y={118} width="92" height="24" rx="6" className="f-node s-line" />
                <text x={320 + i * 104 + 46} y={134} textAnchor="middle" className="f-mid" fontSize="9" fontFamily="var(--font-mono)">
                  {f}
                </text>
              </g>
            ))}
            <text x="465" y="168" textAnchor="middle" className="f-low" fontSize="9" fontFamily="var(--font-mono)">
              planner sees the summary, not the host
            </text>
          </g>
        )}

        {/* test ticks under VERIFY */}
        <g style={{ opacity: step === 6 || step === 8 || step === 9 ? 1 : 0, transition: "opacity .5s" }}>
          <rect x={CN.VERIFY[0]} y={CN.VERIFY[1] + 44} width={NW} height="6" rx="3" className="f-node" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              x={CN.VERIFY[0] + 2 + i * (NW / 6 - 1)}
              y={CN.VERIFY[1] + 46}
              width={NW / 6 - 4}
              height={2}
              rx="1"
              style={{
                fill: step >= 8 || i < 4 ? "rgb(var(--ok) / 0.85)" : "rgb(var(--warn) / 0.8)",
                transition: `fill .4s ${i * 0.12}s`,
              }}
            />
          ))}
          <text x={CN.VERIFY[0] + NW / 2} y={CN.VERIFY[1] + 64} textAnchor="middle" className={step >= 8 ? "f-ok" : "f-low"} fontSize="9" fontFamily="var(--font-mono)">
            {step >= 8 ? "12 passed · exit 0" : "running…"}
          </text>
        </g>
      </svg>

      <div className="mt-3">
        {step === 9 && (
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
