import Section from "@/components/Section";
import { COURSES, ORACLE } from "@/lib/data";

export default function Education() {
  return (
    <Section
      id="education"
      index="05"
      cmd="cat education.yaml && ls credentials --verified"
      title="Foundations."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {/* IISc */}
        <div
          data-reveal
          className="rounded-xl border border-line bg-ink-900/60 p-6 md:p-8"
        >
          <p className="font-mono text-[11px] text-fog-low">
            <span className="text-acc-green">$</span> cat education/institute.yaml
          </p>
          <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-fog-hi">
            Indian Institute of Science <span className="text-fog-low">(IISc)</span>
          </h3>
          <p className="mt-2 font-mono text-xs leading-relaxed text-fog-mid">
            Bangalore · B.Tech in Mathematics and Computing
          </p>
          <p className="mt-1 flex items-center gap-2 font-mono text-[11px] text-fog-low">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-acc-green" />
            Aug 2023 - Present
          </p>
          <div className="mt-6 border-t border-line pt-6">
            <p className="font-mono text-[11px] text-fog-low">relevant_courses:</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {COURSES.map((c) => (
                <li key={c} className="chip">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-fog-low">
            <span className="text-fog-mid">prior:</span> St. Ann&apos;s Senior
            Secondary School, CBSE, Class XII 2023 · Class X 2021
          </p>
        </div>

        {/* Certifications */}
        <div
          data-reveal
          style={{ "--rd": "100ms" } as React.CSSProperties}
          className="rounded-xl border border-line bg-ink-900/60 p-6 md:p-8"
        >
          <p className="font-mono text-[11px] text-fog-low">
            <span className="text-acc-green">$</span> ls credentials --verified
          </p>
          <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-fog-hi">
            Oracle Certified
          </h3>
          <p className="mt-1 font-mono text-[11px] text-fog-low">aug 2025</p>
          <ul className="mt-6 space-y-3">
            {[ORACLE.genai, ORACLE.dataScience].map((c) => (
              <li key={c.name}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-ink-850 px-4 py-3.5 transition-all hover:border-acc-green/40"
                >
                  <span>
                    <span className="block text-sm text-fog-hi">{c.name}</span>
                    <span className="font-mono text-[11px] text-fog-low">
                      oracle · professional credential
                    </span>
                  </span>
                  <span className="font-mono text-xs text-fog-low transition-colors group-hover:text-acc-green">
                    badge ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Leadership */}
        <div
          data-reveal
          className="rounded-xl border border-line bg-ink-900/60 p-6 md:p-8"
        >
          <p className="font-mono text-[11px] text-fog-low">
            <span className="text-acc-green">$</span> cat leadership.log
          </p>
          <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-fog-hi">
            Sci-Tech Coordinator, Rhapsody Fest, IISc
          </h3>
          <p className="mt-1 font-mono text-[11px] text-fog-low">2023 - 2026</p>
          <ul className="mt-5 space-y-3">
            <li className="flex gap-3 text-sm leading-relaxed text-fog-mid">
              <span className="mt-[3px] font-mono text-xs text-acc-green">▸</span>
              <span>
                Led end-to-end organization of three inter-college gaming
                tournaments and a competitive coding contest, managing the full event
                lifecycle for <span className="text-fog-hi">200+ registered teams</span>.
              </span>
            </li>
            <li className="flex gap-3 text-sm leading-relaxed text-fog-mid">
              <span className="mt-[3px] font-mono text-xs text-acc-green">▸</span>
              <span>
                Administered a <span className="text-fog-hi">500+ member</span> Discord
                community for registration and tech support; drove fest publicity
                through digital campaigns across colleges.
              </span>
            </li>
            <li className="flex gap-3 text-sm leading-relaxed text-fog-mid">
              <span className="mt-[3px] font-mono text-xs text-acc-green">▸</span>
              <span>
                Organized and conducted a Competitive Coding Contest at Rhapsody
                Fest, IISc, overseeing problem curation and execution for{" "}
                <span className="text-fog-hi">200+ participants</span> across
                multiple colleges.
              </span>
            </li>
          </ul>
        </div>

        {/* Achievement */}
        <div
          data-reveal
          style={{ "--rd": "100ms" } as React.CSSProperties}
          className="flex flex-col justify-between rounded-xl border border-line bg-ink-900/60 p-6 md:p-8"
        >
          <p className="font-mono text-[11px] text-fog-low">
            <span className="text-acc-green">$</span> cat achievements.txt
          </p>
          <div className="mt-8">
            <p className="font-mono text-5xl text-fog-hi md:text-6xl">
              AIR&nbsp;<span className="text-grad">2412</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fog-mid">
              All India Rank 2412 in{" "}
              <span className="text-fog-hi">JEE Advanced 2023</span>: top 1.34%
              among 180,000+ candidates nationwide.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
