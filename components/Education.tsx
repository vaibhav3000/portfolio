import Section from "@/components/Section";
import { COURSES, ORACLE } from "@/lib/data";

export default function Education() {
  return (
    <Section
      id="education"
      index="07"
      label="Foundations"
      title="The base the work stands on."
    >
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {/* IISc */}
        <div
          data-reveal
          className="rounded-2xl border border-line bg-ink-900/40 p-7 md:p-9"
        >
          <p className="micro">Education</p>
          <h3 className="mt-5 text-2xl font-light tracking-[-0.01em] text-fog-hi">
            Indian Institute of Science, Bangalore
          </h3>
          <p className="mt-2 text-sm text-fog-mid">
            B.Tech in Mathematics and Computing · Aug 2023 - Present
          </p>
          <div className="mt-7 border-t border-line pt-6">
            <p className="micro">Relevant coursework</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {COURSES.map((c) => (
                <li key={c} className="chip">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-7 border-t border-line pt-5 text-xs leading-relaxed text-fog-low">
            Prior: St. Ann&apos;s Senior Secondary School, CBSE · Class XII 2023
            · Class X 2021
          </p>
        </div>

        {/* Certifications */}
        <div
          data-reveal
          style={{ "--rd": "100ms" } as React.CSSProperties}
          className="rounded-2xl border border-line bg-ink-900/40 p-7 md:p-9"
        >
          <p className="micro">Certifications</p>
          <h3 className="mt-5 text-2xl font-light tracking-[-0.01em] text-fog-hi">
            Oracle Professional
          </h3>
          <p className="mt-2 text-sm text-fog-mid">August 2025</p>
          <ul className="mt-7 space-y-3">
            {[ORACLE.genai, ORACLE.dataScience].map((c) => (
              <li key={c.name}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:border-acc/40"
                >
                  <span className="text-sm text-fog-hi">{c.name}</span>
                  <span className="text-xs text-fog-low transition-colors group-hover:text-acc">
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
          className="rounded-2xl border border-line bg-ink-900/40 p-7 md:p-9"
        >
          <p className="micro">Leadership</p>
          <h3 className="mt-5 text-2xl font-light tracking-[-0.01em] text-fog-hi">
            Sci-Tech Coordinator · Rhapsody Fest, IISc
          </h3>
          <p className="mt-2 text-sm text-fog-mid">2023 - 2026</p>
          <ul className="mt-6 space-y-3.5">
            <li className="flex gap-3.5 text-sm leading-relaxed text-fog-mid">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-acc/70" aria-hidden="true" />
              <span>
                Led end-to-end organization of three inter-college gaming
                tournaments and a competitive coding contest for{" "}
                <span className="text-fog-hi">200+ registered teams</span>.
              </span>
            </li>
            <li className="flex gap-3.5 text-sm leading-relaxed text-fog-mid">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-acc/70" aria-hidden="true" />
              <span>
                Administered a <span className="text-fog-hi">500+ member</span>{" "}
                community for registration and tech support, and drove fest
                publicity through digital campaigns.
              </span>
            </li>
          </ul>
        </div>

        {/* Achievement */}
        <div
          data-reveal
          style={{ "--rd": "100ms" } as React.CSSProperties}
          className="rounded-2xl border border-line bg-ink-900/40 p-7 md:p-9"
        >
          <p className="micro">Achievement</p>
          <h3 className="mt-5 text-2xl font-light tracking-[-0.01em] text-fog-hi">
            JEE Advanced 2023
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-fog-mid">
            All India Rank <span className="text-fog-hi">2412</span>: top 1.34%
            among 180,000+ candidates nationwide.
          </p>
        </div>
      </div>
    </Section>
  );
}
