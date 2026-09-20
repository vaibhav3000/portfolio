import Section from "@/components/Section";
import { PROJECTS } from "@/lib/data";

/* ---------- Visual 1: architecture pipeline + benchmark bars ---------- */

function BenchRow({
  label,
  w,
  display,
  tone,
  delay,
}: {
  label: string;
  w: string;
  display: string;
  tone: "green" | "gray";
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 truncate text-[11px] text-fog-low" title={label}>
        {label}
      </span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
        <span
          data-reveal
          className={`bench-bar block h-full rounded-full ${
            tone === "green"
              ? "bg-gradient-to-r from-acc-green/60 to-acc-green"
              : "bg-fog-low/50"
          }`}
          style={{ "--w": w, "--rd": `${delay}ms` } as React.CSSProperties}
        />
      </span>
      <span
        className={`w-14 shrink-0 text-right font-mono text-[11px] ${
          tone === "green" ? "text-acc-green" : "text-fog-low"
        }`}
      >
        {display}
      </span>
    </div>
  );
}

function MambaViz() {
  const models = ["S4D", "Mamba", "Mamba-2", "Mamba-3"];
  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title">s4-to-mamba · pytest</span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="font-mono text-[10px] tracking-wider text-fog-low">
          <span className="text-acc-green">$</span> make --models --from-first-principles
        </p>
        <div className="mt-4 flex items-center">
          {models.map((m, i) => (
            <div key={m} className="flex flex-1 items-center last:flex-none">
              <span
                className={`shrink-0 rounded-md border px-2.5 py-1.5 font-mono text-[11px] ${
                  i === models.length - 1
                    ? "border-acc-green/50 bg-acc-green/10 text-acc-green shadow-glow"
                    : "border-line bg-ink-850 text-fog-mid"
                }`}
              >
                {m}
              </span>
              {i < models.length - 1 && <span className="flow mx-1" aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div className="my-6 border-t border-line" />

        <p className="mb-4 font-mono text-[10px] tracking-wider text-fog-low">
          <span className="text-acc-green">$</span> pytest --capability-bench
        </p>
        <div className="space-y-3">
          <p className="font-mono text-[10px] text-fog-low">// parity tracking</p>
          <BenchRow label="complex-valued (M3)" w="98.3%" display="98.3%" tone="green" delay={100} />
          <BenchRow label="real / transformer" w="56%" display="≤56%" tone="gray" delay={200} />
          <p className="pt-2 font-mono text-[10px] text-fog-low">// selective copying</p>
          <BenchRow label="selective SSMs" w="67%" display="67%" tone="green" delay={300} />
          <BenchRow label="LTI S4D" w="6%" display="6%" tone="gray" delay={400} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Visual 2: AIRE evaluation run ---------- */

function AireViz() {
  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title">aire · run #412</span>
      </div>
      <div className="term-body space-y-2.5">
        <p>
          <span className="text-acc-green">$</span>{" "}
          <span className="text-fog-hi">aire run</span> --suite rag_v3 --cases 26
        </p>
        <p className="text-fog-low">
          <span className="text-fog-mid">[scan]</span> 3 RAG versions · deterministic
          metrics · replayable storage
        </p>
        <p>
          <span className="text-fog-mid">[flag]</span>{" "}
          <span className="text-rose-400">groundedness 0.57 → 0.00</span>{" "}
          <span className="text-rose-400/70">▼ fluency-for-grounding regression</span>
        </p>
        <p>
          <span className="text-fog-mid">[fix]</span>{" "}
          <span className="text-acc-green">abstention 0.0 → 1.0</span> ·{" "}
          <span className="text-acc-green">grounding 1.0</span>{" "}
          <span className="text-acc-green/70">✓ gemini responder</span>
        </p>
        <p className="text-fog-low">
          <span className="text-fog-mid">[done]</span> 26/26 cases · 15 s/case ·
          attribution logged <span className="text-acc-green/70">✓</span>
        </p>
        <p>
          <span className="text-acc-green">$</span>
          <span className="blink ml-1 inline-block h-3.5 w-[7px] translate-y-[2px] bg-acc-green/80" />
        </p>
      </div>
    </div>
  );
}

/* ---------- Visual 3: agent state machine ---------- */

function AgentViz() {
  const states = ["PLAN", "ACT", "OBSERVE", "VERIFY"];
  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title">repo-engineer · sandboxed</span>
      </div>
      <div className="term-body space-y-3">
        <p>
          <span className="text-acc-green">$</span>{" "}
          <span className="text-fog-hi">repo-engineer solve</span> --task swe-04
        </p>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {states.map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className="state-chip rounded border border-fog-low/20 px-2 py-1 font-mono text-[10px] text-fog-low">
                {s}
              </span>
              {i < states.length - 1 && <span className="text-fog-low/50 text-[10px]">▸</span>}
            </span>
          ))}
        </div>
        <p className="text-fog-low">
          <span className="text-fog-mid">tools:</span> 7 validated · schema checks ·
          workspace path jail · AUTO/ASK/DENY
        </p>
        <p className="text-fog-low">
          <span className="text-fog-mid">policy:</span> completion ={" "}
          <span className="text-acc-green">green test evidence</span>, never model claims
        </p>
        <p>
          <span className="text-fog-mid">result:</span>{" "}
          <span className="text-acc-green">4/4 SWE tasks · 0 failed tool calls</span>{" "}
          <span className="text-acc-green/70">✓</span>
        </p>
      </div>
    </div>
  );
}

const VISUALS = {
  mamba: MambaViz,
  aire: AireViz,
  agent: AgentViz,
};

/* ---------- Section ---------- */

export default function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      cmd="ls ~/projects --featured"
      title="Selected work."
      note="Three systems, three domains. Each one built to be measured, not just demonstrated."
    >
      <div>
        {PROJECTS.map((p, i) => {
          const Visual = VISUALS[p.visual];
          const flip = i % 2 === 1;
          return (
            <article
              key={p.id}
              className="grid items-center gap-10 border-t border-line py-16 first:border-t-0 first:pt-4 lg:grid-cols-12 lg:gap-14"
            >
              <div
                data-reveal
                className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}
              >
                <Visual />
              </div>
              <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
                <p data-reveal className="font-mono text-xs">
                  <span className="text-acc-green">$ projects/{p.num}</span>
                  <span className="text-fog-low"> · {p.domain}</span>
                </p>
                <h3
                  data-reveal
                  style={{ "--rd": "60ms" } as React.CSSProperties}
                  className="mt-4 font-display text-2xl font-semibold tracking-tight text-fog-hi md:text-4xl"
                >
                  {p.name}
                </h3>
                <p
                  data-reveal
                  style={{ "--rd": "120ms" } as React.CSSProperties}
                  className="mt-5 max-w-2xl leading-relaxed text-fog-mid"
                >
                  {p.tagline}
                </p>

                <div
                  data-reveal
                  style={{ "--rd": "180ms" } as React.CSSProperties}
                  className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4"
                >
                  {p.metrics.map((m) => (
                    <div key={m.label} className="bg-ink-900/80 px-4 py-3.5">
                      <p className="font-mono text-sm text-acc-cyan sm:text-base">
                        {m.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-fog-low">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                <ul
                  data-reveal
                  style={{ "--rd": "240ms" } as React.CSSProperties}
                  className="mt-7 space-y-2.5"
                >
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-sm leading-relaxed text-fog-mid">
                      <span className="mt-[3px] font-mono text-xs text-acc-green">▸</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div
                  data-reveal
                  style={{ "--rd": "300ms" } as React.CSSProperties}
                  className="mt-8 flex flex-wrap items-center gap-3"
                >
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-line bg-ink-900/60 px-4 py-2 font-mono text-xs text-fog-hi transition-all hover:border-acc-green/40 hover:text-acc-green"
                  >
                    <span className="text-fog-low">$</span> view source ↗
                  </a>
                  <span className="flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
