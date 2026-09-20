import Section from "@/components/Section";
import { SKILLS } from "@/lib/data";

const SPANS = ["md:col-span-2", "md:col-span-4", "md:col-span-4", "md:col-span-2", "md:col-span-6"];

export default function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      cmd="skills --tree --no-fake-percentages"
      title="Toolchain."
      note="Grouped the way they're actually used: no proficiency bars, no invented numbers."
    >
      <div className="grid gap-4 md:grid-cols-6">
        {SKILLS.map((g, i) => (
          <div
            key={g.slug}
            data-reveal
            style={{ "--rd": `${i * 70}ms` } as React.CSSProperties}
            className={`group rounded-xl border border-line bg-ink-900/60 p-5 transition-colors duration-300 hover:border-fog-low/40 ${SPANS[i]}`}
          >
            <p className="font-mono text-[11px] text-fog-low">
              <span className="text-acc-green">$</span> ls ~/skills/{g.slug}
            </p>
            <h3 className="mb-4 mt-2 font-display text-lg font-medium tracking-tight text-fog-hi">
              {g.name}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="chip transition-colors group-hover:border-fog-low/30"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
