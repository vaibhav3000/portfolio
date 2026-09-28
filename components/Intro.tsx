import Section from "@/components/Section";
import { SITE } from "@/lib/data";

const FACTS = [
  { label: "Location", value: "Bangalore, India" },
  { label: "Education", value: "IISc · B.Tech Mathematics and Computing" },
  { label: "Focus", value: "Sequence models · LLM evaluation · reliable agents" },
  { label: "Recently", value: "AI/ML Research Intern, Ericsson" },
];

const INTERESTS = [
  "efficient sequence modeling (SSMs)",
  "LLM evaluation & observability",
  "tool-using agents & sandboxing",
  "reproducible experimentation",
];

export default function Intro() {
  return (
    <Section
      id="about"
      index="01"
      label="Introduction"
      title={
        <>
          I work across the full arc of an AI system: architectures from first
          principles, evaluation that proves they behave, agents that finish
          with green tests.
        </>
      }
    >
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          <p className="max-w-2xl text-base leading-relaxed text-fog-mid md:text-lg">
            I&apos;m {SITE.name.split(" ")[0]}, an AI/ML engineer and B.Tech
            student in Mathematics and Computing at the Indian Institute of
            Science. Recent work spans benchmarking state-space models against
            Transformers at Ericsson, reproducing Mamba-3&apos;s capability
            claims in pure PyTorch, and building a reliability engine for
            LLM/RAG systems.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog-mid md:text-lg">
            The common thread:{" "}
            <span className="text-fog-hi">measure first, then believe.</span>
          </p>
          <p className="mt-10 text-sm leading-loose text-fog-low">
            {INTERESTS.map((it, i) => (
              <span key={it}>
                {i > 0 && (
                  <span className="mx-2.5 text-fog-low/50" aria-hidden="true">
                    ·
                  </span>
                )}
                <span className="text-fog-mid">{it}</span>
              </span>
            ))}
          </p>
        </div>

        <div className="lg:col-span-5">
          <dl className="border-t border-line" data-reveal style={{ "--rd": "120ms" } as React.CSSProperties}>
            {FACTS.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-1.5 border-b border-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <dt className="micro shrink-0">{f.label}</dt>
                <dd className="text-sm text-fog-hi sm:text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
