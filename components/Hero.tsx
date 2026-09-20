import HeroVisual from "@/components/HeroVisual";
import { SITE } from "@/lib/data";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* vertical side note (desktop) */}
      <p
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] tracking-[0.35em] text-fog-low/60 xl:block"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)" }}
        aria-hidden="true"
      >
        B.TECH MATHEMATICS &amp; COMPUTING · IISC BANGALORE
      </p>

      <div className="container-x grid min-h-[100svh] items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.12fr_0.88fr] lg:pt-24">
        <div>
          <p data-reveal className="font-mono text-sm text-fog-mid">
            <span className="text-acc-green">$</span> whoami
          </p>

          <h1 className="mt-6 font-display font-semibold tracking-tight">
            <span
              data-reveal
              style={{ "--rd": "60ms" } as React.CSSProperties}
              className="block text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl xl:text-[5.6rem]"
            >
              VAIBHAV
            </span>
            <span
              data-reveal
              style={{ "--rd": "120ms" } as React.CSSProperties}
              className="text-grad block text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl xl:text-[5.6rem]"
            >
              MAHORE
            </span>
          </h1>

          <p
            data-reveal
            style={{ "--rd": "180ms" } as React.CSSProperties}
            className="mt-6 font-mono text-sm tracking-wide text-fog-mid"
          >
            <span className="text-acc-cyan">AI/ML ENGINEER</span>
            <span className="text-fog-low"> · </span>
            B.TECH MATH &amp; COMPUTING, IISC BANGALORE
          </p>

          <p
            data-reveal
            style={{ "--rd": "240ms" } as React.CSSProperties}
            className="mt-8 max-w-xl text-lg leading-relaxed text-fog-mid"
          >
            I build reliable AI systems, investigate efficient sequence models,
            and turn research ideas into verifiable engineering systems.
          </p>

          <div
            data-reveal
            style={{ "--rd": "300ms" } as React.CSSProperties}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="#projects" className="btn-primary">
              <span className="text-acc-green">$</span> view projects
            </a>
            <a href={SITE.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <span className="text-fog-low">github.com/</span>vaibhav3000
            </a>
          </div>

          <p
            data-reveal
            style={{ "--rd": "360ms" } as React.CSSProperties}
            className="mt-6 font-mono text-xs text-fog-low"
          >
            <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-acc-cyan">
              linkedin ↗
            </a>
            <span className="mx-3 text-fog-low/50">|</span>
            <a href={SITE.links.resume} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-acc-cyan">
              resume.pdf ↗
            </a>
            <span className="mx-3 text-fog-low/50">|</span>
            <a href={SITE.links.leetcode} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-acc-cyan">
              leetcode ↗
            </a>
          </p>
        </div>

        <div data-reveal style={{ "--rd": "200ms" } as React.CSSProperties} className="relative">
          <HeroVisual />

          {/* floating terminal metadata card */}
          <div className="term absolute -bottom-6 left-0 w-56 sm:w-64">
            <div className="term-bar">
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-title">meta · zsh</span>
            </div>
            <div className="space-y-2.5 p-4 font-mono text-[11px] leading-relaxed">
              <div>
                <p className="text-acc-green">$ focus</p>
                <p className="text-fog-mid">sequence modeling</p>
                <p className="text-fog-mid">llm evaluation</p>
                <p className="text-fog-mid">ai agents</p>
              </div>
              <div>
                <p className="text-acc-green">$ based</p>
                <p className="text-fog-mid">bangalore, india</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="container-x relative hidden justify-center pb-10 lg:flex">
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-fog-low">SCROLL</span>
          <span className="scroll-line" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
