import Section from "@/components/Section";
import { RESEARCH } from "@/lib/data";

export default function Research() {
  return (
    <Section
      id="research"
      index="05"
      label="Research"
      title="Questions I keep returning to."
      lede="Work-in-progress notes rather than publications. Every entry below links to a public repository on this page."
    >
      <ol className="border-t border-line">
        {RESEARCH.map((r, i) => (
          <li
            key={r.id}
            data-reveal
            className="group grid gap-3 border-b border-line py-9 md:grid-cols-12 md:items-baseline md:gap-8"
          >
            <p className="micro md:col-span-1">
              R.{String(i + 1).padStart(2, "0")}
            </p>
            <div className="md:col-span-7">
              <h3 className="text-xl font-normal tracking-[-0.01em] text-fog-hi transition-colors duration-200 group-hover:text-acc md:text-2xl">
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer">
                    {r.title}
                    <span aria-hidden="true" className="ml-2 text-sm text-fog-low">
                      ↗
                    </span>
                  </a>
                ) : (
                  r.title
                )}
              </h3>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-fog-mid">
                {r.line}
              </p>
            </div>
            <p className="micro md:col-span-4 md:text-right">{r.meta}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
