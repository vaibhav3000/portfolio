"use client";

import { LabControls, MeasuredBadge, SchematicBadge, useLabKeyboard, useLabSteps } from "@/components/lab/shared";

/**
 * Project 03 explainer: planner proposes, the deterministic runtime
 * disposes. Visualizes the validate → jail → act → observe → verify
 * loop, the REPLAN branch, and the measured benchmark results.
 */

const STATES = ["PLAN", "ACT", "OBSERVE", "VERIFY", "COMPLETE"];

export default function LabAgent() {
  const STEPS = 8;
  const lab = useLabSteps(STEPS);
  const key = useLabKeyboard(lab);

  const texts = [
    "The LLM planner proposes exactly one tool call - a suggestion. It never executes anything itself.",
    "ToolSpec.validate checks the proposal's schema. Malformed calls return as rejected observations; the loop never crashes.",
    "Every path argument is resolved and must land inside the workspace. ../, absolute paths and drive letters are rejected.",
    "ACT: the runtime executes the validated tool - read, search, apply_edit, git_diff, or the allowlisted test command.",
    "OBSERVE: results return as observations and enter the agent's history as data, never as instructions.",
    "VERIFY re-runs the full test suite. Completion is decided by the exit code, not by the model's confidence.",
    "First attempt failed on the benchmark's tax task: the machine transitions to REPLAN and the planner retries once.",
    "Green tests open COMPLETE - reachable only from VERIFY. Same gates for the scripted planner and live Gemini.",
  ];

  const stateActive = (s: string) => {
    if (s === "PLAN") return lab.step === 0 || lab.step === 6;
    if (s === "ACT") return lab.step === 3;
    if (s === "OBSERVE") return lab.step === 4;
    if (s === "VERIFY") return lab.step === 5 || lab.step === 7;
    if (s === "COMPLETE") return lab.step === 7;
    return false;
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={key}
      aria-label="Agent loop lab: use space to play or pause, arrows to step, R to reset"
      className="rounded-xl border border-line bg-ink-950/60 p-4 outline-none focus-visible:border-acc/50 md:p-5"
    >
      {/* planner vs runtime */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`rounded-lg border border-dashed p-3 transition-colors duration-500 ${
            lab.step === 0 || lab.step === 6 ? "border-fog-mid/60 bg-ink-900/70" : "border-line bg-transparent"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog-low">
            LLM planner
          </p>
          <p className="mt-1 text-[13px] leading-snug text-fog-mid">Proposes one tool call</p>
          {(lab.step === 0 || lab.step === 6) && (
            <p className="mt-2 rounded border border-line bg-ink-950 px-2 py-1.5 font-mono text-[10px] text-fog-hi">
              propose: apply_edit(cart.py)
            </p>
          )}
        </div>
        <div
          className={`rounded-lg border p-3 transition-colors duration-500 ${
            lab.step >= 1 && lab.step <= 7 ? "border-acc/50 bg-acc/5" : "border-line bg-transparent"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-acc/80">
            Deterministic runtime
          </p>
          <p className="mt-1 text-[13px] leading-snug text-fog-mid">
            Validates, jails, executes, decides
          </p>
          <p className="mt-2 font-mono text-[10px] text-fog-low">
            {lab.step === 1 && "✓ schema valid"}
            {lab.step === 2 && "✓ path inside workspace"}
            {lab.step === 3 && "▶ executing tool…"}
            {lab.step === 4 && "✓ observation → history"}
            {lab.step === 5 && "▶ test suite re-running…"}
            {lab.step === 6 && "✗ tests failed → REPLAN"}
            {lab.step === 7 && "✓ exit 0 → COMPLETE"}
            {lab.step === 0 && "awaiting proposal"}
          </p>
        </div>
      </div>

      {/* test bar for VERIFY */}
      <div
        className="mt-3 transition-opacity duration-500"
        style={{ opacity: lab.step === 5 || lab.step === 7 ? 1 : 0 }}
        aria-hidden="true"
      >
        <div className="h-1.5 overflow-hidden rounded-full bg-ink-800/60">
          <div
            className={`h-full rounded-full transition-[width] duration-[1200ms] ease-out ${
              lab.step === 7 ? "w-full bg-acc" : "w-2/3 bg-fog-mid"
            }`}
          />
        </div>
        <p className="mt-1 font-mono text-[10px] text-fog-low">
          {lab.step === 7 ? "test suite: 12 passed · exit 0" : "test suite: running…"}
        </p>
      </div>

      {/* state track */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {STATES.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors duration-300 ${
                stateActive(s)
                  ? s === "COMPLETE"
                    ? "border-acc/70 bg-acc/15 text-fog-hi"
                    : "border-fog-mid/50 bg-ink-900 text-fog-hi"
                  : "border-line text-fog-low/70"
              }`}
            >
              {s}
            </span>
            {i < STATES.length - 1 && (
              <span className="text-[9px] text-fog-low/60" aria-hidden="true">
                →
              </span>
            )}
          </span>
        ))}
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors duration-300 ${
            lab.step === 6 ? "border-fog-mid/50 bg-ink-900 text-fog-hi" : "border-line text-fog-low/70"
          }`}
        >
          REPLAN
        </span>
      </div>

      <div className="mt-4 min-h-[40px]">
        {lab.step === 2 && (
          <div className="mb-2 flex items-center gap-3">
            <SchematicBadge />
            <span className="text-xs text-fog-low">per-path-argument jail, not an OS sandbox - stated in the README</span>
          </div>
        )}
        {(lab.step === 6 || lab.step === 7) && (
          <div className="mb-2 flex items-center gap-3">
            <MeasuredBadge />
            <span className="text-xs text-fog-low">results/benchmark_results.json · llm_benchmark_results.json</span>
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
