import Section from "@/components/Section";
import { SKILLS } from "@/lib/data";

export default function Skills() {
  return (
    <Section
      id="skills"
      index="06"
      label="Capabilities"
      title="A toolkit, organized by what it builds."
    >
      <dl className="border-t border-line">
        {SKILLS.map((s, i) => (
          <div
            key={s.slug}
            data-reveal
            style={{ "--rd": `${i * 60}ms` } as React.CSSProperties}
            className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8"
          >
            <dt className="micro md:col-span-3 md:pt-1.5">{s.name}</dt>
            <dd className="flex flex-wrap items-baseline gap-y-1.5 md:col-span-9">
              {s.items.map((item, j) => (
                <span key={item} className="text-[15px] leading-relaxed text-fog-hi/85 md:text-base">
                  {item}
                  {j < s.items.length - 1 && (
                    <span className="ml-2.5 text-fog-low/50" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
