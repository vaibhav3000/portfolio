import Link from "next/link";
import HeroField from "@/components/HeroField";
import HeroFieldFallback from "@/components/HeroFieldFallback";
import { SITE } from "@/lib/data";

/**
 * Proof ledger: the hero's one bold element. Each line is a measured result
 * that links to where it is shown, written like a passing test run because
 * verification is the through-line of the work.
 */
const PROOF: { result: string; source: string; href: string; page?: boolean }[] = [
  {
    result: "10.7x lower latency, 42.6x less GPU memory than a Transformer",
    source: "Ericsson research internship, 2026",
    href: "#experience",
  },
  {
    result: "Groundedness regression (0.57 → 0.00) blocked in CI on every push",
    source: "AIRE, LLM/RAG evaluation engine",
    href: "/projects/aire/",
    page: true,
  },
  {
    result: "8/8 adversarial tool calls rejected, 0 failed tool calls",
    source: "Autonomous Repository Engineer",
    href: "/projects/repo-engineer/",
    page: true,
  },
  {
    result: "98.3% parity accuracy where baselines stay at chance",
    source: "S4 to Mamba-3, from first principles",
    href: "/projects/s4-to-mamba/",
    page: true,
  },
  {
    result: "Top 100 national finalist",
    source: "Amazon ML Challenge 2026",
    href: "#education",
  },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" aria-label="Introduction">
      {/* Signature visual: static field first, WebGL fades in over it */}
      <div className="absolute inset-0" aria-hidden="true">
        <HeroFieldFallback />
        <HeroField />
        {/* readability scrims: left for type, bottom for the transition out */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-x relative z-10 grid min-h-[100svh] content-center gap-14 pb-28 pt-32 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <p className="micro flex items-center gap-3" data-reveal>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-acc"
              aria-hidden="true"
            />
            AI/ML Engineer
            <span className="text-fog-low/60" aria-hidden="true">
              ·
            </span>
            Bangalore, India
          </p>

          <h1 className="mt-7 text-[clamp(3.2rem,9vw,8.2rem)] font-light leading-[0.93] tracking-[-0.035em] text-fog-hi">
            <span className="block" data-reveal>
              Vaibhav
            </span>{" "}
            <span className="block" data-reveal style={{ "--rd": "120ms" } as React.CSSProperties}>
              Mahore
            </span>
          </h1>

          <p
            className="mt-8 max-w-[34rem] text-lg leading-relaxed text-fog-mid md:text-xl"
            data-reveal
            style={{ "--rd": "240ms" } as React.CSSProperties}
          >
            Final-year Mathematics and Computing student at IISc Bangalore,
            building efficient sequence models, LLM evaluation tooling and
            verified coding agents.
          </p>

          <p
            className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-ink-950/40 px-4 py-2 text-[13px] text-fog-hi backdrop-blur-sm"
            data-reveal
            style={{ "--rd": "320ms" } as React.CSSProperties}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[rgb(var(--ok))] motion-safe:animate-pulse"
              aria-hidden="true"
            />
            Open to 2027 full-time roles and internships
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-4"
            data-reveal
            style={{ "--rd": "400ms" } as React.CSSProperties}
          >
            <a href="#projects" className="btn-primary" data-magnetic>
              View projects
              <span aria-hidden="true" className="text-base leading-none">
                ↓
              </span>
            </a>
            <a
              href={SITE.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              data-magnetic
            >
              Résumé (PDF)
            </a>
          </div>

          <div
            className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3"
            data-reveal
            style={{ "--rd": "480ms" } as React.CSSProperties}
          >
            <a
              href={SITE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet text-[13px] text-fog-mid"
            >
              GitHub
              <span aria-hidden="true" className="text-[11px]">
                ↗
              </span>
            </a>
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet text-[13px] text-fog-mid"
            >
              LinkedIn
              <span aria-hidden="true" className="text-[11px]">
                ↗
              </span>
            </a>
            <a href={`mailto:${SITE.email}`} className="link-quiet text-[13px] text-fog-mid">
              {SITE.email}
            </a>
          </div>
        </div>

        {/* Proof ledger */}
        <div
          className="lg:col-span-5"
          data-reveal
          style={{ "--rd": "560ms" } as React.CSSProperties}
        >
          <div className="rounded-2xl border border-line bg-ink-950/55 p-6 backdrop-blur-md md:p-7">
            <p className="micro">Verified results</p>
            <ul className="mt-4">
              {PROOF.map((p) => {
                const body = (
                  <>
                    <span
                      className="mt-[3px] font-mono text-[13px] leading-none text-[rgb(var(--ok))]"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>
                      <span className="block text-[14px] leading-snug text-fog-hi transition-colors group-hover:text-acc">
                        {p.result}
                      </span>
                      <span className="mt-1.5 block font-mono text-[11px] leading-none text-fog-low">
                        {p.source}
                      </span>
                    </span>
                  </>
                );
                const cls = "group grid grid-cols-[auto_1fr] gap-x-3.5 py-3.5";
                return (
                  <li key={p.source} className="border-t border-line first:border-t-0">
                    {p.page ? (
                      <Link href={p.href} className={cls}>
                        {body}
                      </Link>
                    ) : (
                      <a href={p.href} className={cls}>
                        {body}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* bottom bar: scroll cue + registration coordinates */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex items-end justify-between pb-9">
          <div className="flex items-center gap-4" aria-hidden="true">
            <span className="micro">Scroll</span>
            <span className="scroll-line block" />
          </div>
          <p className="micro hidden sm:block" aria-hidden="true">
            12.97° N / 77.59° E
          </p>
        </div>
      </div>
    </section>
  );
}
