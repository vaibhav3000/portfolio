import HeroField from "@/components/HeroField";
import HeroFieldFallback from "@/components/HeroFieldFallback";
import { SITE } from "@/lib/data";

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

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-center pb-24 pt-36">
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

        <h1 className="mt-7 text-[clamp(3.6rem,10.5vw,10rem)] font-light leading-[0.93] tracking-[-0.035em] text-fog-hi">
          <span className="block" data-reveal>
            Vaibhav
          </span>
          <span className="block" data-reveal style={{ "--rd": "120ms" } as React.CSSProperties}>
            Mahore
          </span>
        </h1>

        <p
          className="mt-9 max-w-[34rem] text-lg leading-relaxed text-fog-mid md:text-xl"
          data-reveal
          style={{ "--rd": "240ms" } as React.CSSProperties}
        >
          Building reliable AI systems, efficient sequence models, and
          evaluation infrastructure for intelligent software.
        </p>

        <div
          className="mt-11 flex flex-wrap items-center gap-4"
          data-reveal
          style={{ "--rd": "360ms" } as React.CSSProperties}
        >
          <a href="#projects" className="btn-primary">
            View Projects
            <span aria-hidden="true" className="text-base leading-none">
              ↓
            </span>
          </a>
          <a
            href={SITE.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            View Resume
          </a>
        </div>

        <div
          className="mt-9 flex items-center gap-7"
          data-reveal
          style={{ "--rd": "460ms" } as React.CSSProperties}
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
